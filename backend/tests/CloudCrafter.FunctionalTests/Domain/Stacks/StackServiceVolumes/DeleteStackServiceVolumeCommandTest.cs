using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.Volumes;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.StackServiceVolumes;

using static Testing;

public class DeleteStackServiceVolumeCommandTest : BaseStackServiceVolumeTest
{
    private DeleteStackServiceVolumeCommand Command =
        new(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDeleteBecauseUserHasNotTeamRights(bool attachToTeam)
    {
        var userId = await RunAsDefaultUserAsync();
        var volume1 = await GenerateStackServiceVolume(StackServiceVolumeType.LocalMount);

        var fetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume1.Id,
            inc =>
                inc.Include(x => x.StackService)
                    .ThenInclude(x => x.Stack)
                    .ThenInclude(x => x!.Environment)
                    .ThenInclude(x => x.Project)
                    .ThenInclude(x => x.Team)
        );

        await AssertVolumeCount(1);

        if (attachToTeam)
        {
            await AddToTeam(fetchedVolume!.StackService.Stack!.Environment.Project.Team, userId);
        }

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () =>
                await SendAsync(
                    new DeleteStackServiceVolumeCommand(
                        StackId: fetchedVolume!.StackService.StackId,
                        StackServiceId: fetchedVolume.StackServiceId,
                        StackServiceVolumeId: fetchedVolume.Id
                    )
                )
        );
    }

    [Test]
    public async Task ShouldNotBeAbleToDeleteVolumeBecauseStackServiceDoesNotExists()
    {
        await RunAsAdministratorAsync();
        await AssertVolumeCount(0);

        var exception = Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Command));
        exception.Should().NotBeNull();
        exception
            .Message.Should()
            .Be("Queried object Stack service not found was not found, Key: StackService");
        await AssertVolumeCount(0);
    }

    [Test]
    public async Task ShouldNotBeAbleToDeleteVolumeBecauseVolumeDoesNotExists()
    {
        await RunAsAdministratorAsync();
        await AssertVolumeCount(0);

        var stackService = await GenerateStackService();

        var exception = Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        StackId = stackService.StackId,
                        StackServiceId = stackService.Id,
                    }
                )
        );
        exception.Should().NotBeNull();
        exception
            .Message.Should()
            .Be("Queried object Volume not found was not found, Key: StackServiceVolume");
        await AssertVolumeCount(0);
    }

    [Test]
    public async Task ShouldBeAbleToDeleteAVolume()
    {
        await RunAsAdministratorAsync();
        await AssertVolumeCount(0);
        var volume1 = await GenerateStackServiceVolume(StackServiceVolumeType.LocalMount);

        var fetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume1.Id,
            inc => inc.Include(x => x.StackService)
        );

        await AssertVolumeCount(1);
        await SendAsync(
            new DeleteStackServiceVolumeCommand(
                StackId: fetchedVolume!.StackService.StackId,
                StackServiceId: fetchedVolume.StackServiceId,
                StackServiceVolumeId: fetchedVolume.Id
            )
        );

        await AssertVolumeCount(0);
    }
}
