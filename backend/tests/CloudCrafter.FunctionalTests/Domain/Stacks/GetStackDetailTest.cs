using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class GetStackDetailTest : BaseTestFixture
{
    private readonly GetStackDetailQuery Query = new() { StackId = Guid.NewGuid() };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldThrowErrorWhenNoAccessBecauseItDoesNotExists(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);

        var stackId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Query with { StackId = stackId })
        );

        ex.Message.Should().Be($"User does not have access to stack {stackId}");
    }

    [Test]
    public async Task ShouldNotBeAbleToAccessStackBecauseUserIsNotPartOfTeam()
    {
        await RunAsDefaultUserAsync();

        var team = await CreateTeam();

        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        var stack = FakerInstances.StackFaker(environment.Id).Generate();
        await AddAsync(stack);

        Assert.ThrowsAsync<CannotAccessTeamException>(
            async () => await SendAsync(new GetStackDetailQuery { StackId = stack.Id })
        );
    }

    [TestCase(true, false, false)]
    [TestCase(false, true, false)]
    [TestCase(false, false, true)]
    public async Task ShouldReturnStack(bool isAdmin, bool isTeamOwner, bool attachToTeam)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(isTeamOwner ? userId : null);
        if (attachToTeam)
        {
            await AddToTeam(team, userId);
        }

        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        var stack = FakerInstances.StackFaker(environment.Id).Generate();
        await AddAsync(stack);

        var result = await SendAsync(new GetStackDetailQuery { StackId = stack.Id });

        result.Should().NotBeNull();
        result!.Id.Should().Be(stack.Id);
        result.Name.Should().Be(stack.Name);
    }
}
