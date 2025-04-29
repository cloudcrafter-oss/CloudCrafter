using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class DispatchImportStackServicesFromGitRepositoryCommandTest : BaseStackTest
{
    private readonly DispatchImportStackServicesFromGitRepositoryCommand Command =
        new() { StackId = Guid.NewGuid() };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDispatchWhenStackDoesNotExists(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);

        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDispatchBecauseUserHasNotRightPermissions(bool attachToTeam)
    {
        var userId = await RunAsDefaultUserAsync();

        var team = await CreateTeam();

        if (attachToTeam)
        {
            await AddToTeam(team, userId);
        }

        var stack = await CreateStack(team.Id, DemoPostgresPath, DemoBranch, DemoPostgresPath);

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () => await SendAsync(Command with { StackId = stack.Id })
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToDispatchCommand(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(!isAdmin ? userId : null);

        var stack = await CreateStack(team.Id, DemoRepo, DemoBranch, DemoPostgresPath);

        await SendAsync(Command with { StackId = stack.Id });

        var stackFromDb = FetchEntity<Stack>(
            s => s.Id == stack.Id,
            inc => inc.Include(s => s.DockerComposeData)
        );

        stackFromDb.Should().NotBeNull();
        stackFromDb!.DockerComposeData.Should().NotBeNull();
        stackFromDb.DockerComposeData.DockerComposeFile.Should().NotBeNull();
        stackFromDb
            .DockerComposeData.DockerComposeFile.Should()
            .ContainAll("image: postgres:16-alpine", "cloudcrafter.service.type=database");
    }
}
