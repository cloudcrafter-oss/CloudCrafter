using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.Volumes;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Namotion.Reflection;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.StackServiceVolumes;

using static Testing;

public class UpdateStackServiceVolumeCommandTest : BaseStackServiceVolumeTest
{
    private UpdateStackServiceVolumeCommand Command =
        new()
        {
            StackId = Guid.NewGuid(),
            StackServiceId = Guid.NewGuid(),
            Name = "dummy",
            Type = StackServiceVolumeTypeDto.DockerVolume,
            Source = null,
            Target = "/dummy",
        };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToUpdateNonExistingVolume(bool isAdmin)
    {
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        await AssertVolumeCount(0);
        var stackService = await GenerateStackService(ownerId);

        Command = Command with
        {
            StackId = stackService.StackId,
            StackServiceId = stackService.Id,
            Id = Guid.NewGuid(),
            Source = "dummy",
            Target = "/dummy",
            Type = StackServiceVolumeTypeDto.LocalMount,
        };

        var exception = Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Command));

        exception!
            .Message.Should()
            .Be("Queried object Volume not found was not found, Key: StackServiceVolume");
        await AssertVolumeCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToUpdateValueToDockerVolumeWithSource(bool isAdmin)
    {
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        var volume = await GenerateStackServiceVolume(
            StackServiceVolumeType.LocalMount,
            null,
            ownerId
        );
        volume.Type.Should().Be(StackServiceVolumeType.LocalMount);
        volume.SourcePath.Should().NotBeNullOrEmpty();
        await AssertVolumeCount(1);

        // refetch with relations
        var fetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume.Id,
            include => include.Include(x => x.StackService)
        );
        fetchedVolume.Should().NotBeNull();

        Command = Command with
        {
            StackId = fetchedVolume!.StackService.StackId,
            StackServiceId = fetchedVolume.StackServiceId,
            Id = fetchedVolume.Id,
            Source = "dummy",
            Target = "/dummy",
            Type = StackServiceVolumeTypeDto.DockerVolume,
        };

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(Command)
        );
        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("Source").And.HaveCount(1);
        exception!.Errors["Source"].Should().Contain("Source can only be used with LocalVolumes");

        // refetch with relations
        var refetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume.Id,
            include => include.Include(x => x.StackService)
        );
        refetchedVolume.Should().NotBeNull();

        refetchedVolume
            .Should()
            .BeEquivalentTo(fetchedVolume, x => x.Excluding(e => e.StackService));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToUpdateLocalMountVolume(bool isAdmin)
    {
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        await AssertVolumeCount(0);
        var volume = await GenerateStackServiceVolume(
            StackServiceVolumeType.LocalMount,
            faker =>
                faker
                    .RuleFor(x => x.SourcePath, "/my/source")
                    .RuleFor(x => x.DestinationPath, "/my/destination"),
            ownerId
        );
        await AssertVolumeCount(1);

        // refetch with relations
        var fetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume.Id,
            include => include.Include(x => x.StackService)
        );
        fetchedVolume.Should().NotBeNull();

        Command = Command with
        {
            StackId = fetchedVolume!.StackService.StackId,
            StackServiceId = fetchedVolume.StackServiceId,
            Id = fetchedVolume.Id,
            Source = "dummy",
            Target = "/dummy",
            Type = StackServiceVolumeTypeDto.LocalMount,
        };

        var result = await SendAsync(Command);

        result.Should().NotBeEmpty();
        result.Should().Be(fetchedVolume.Id);

        var refetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume.Id,
            include => include.Include(x => x.StackService)
        );
        refetchedVolume.Should().NotBeNull();

        refetchedVolume!.SourcePath.Should().Be("dummy");
        refetchedVolume.DestinationPath.Should().Be("/dummy");
        refetchedVolume.Type.Should().Be(StackServiceVolumeType.LocalMount);

        await AssertVolumeCount(1);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToUpdateLocalMountVolumeBecauseUserIsNoTeamOwner(
        bool attachUser
    )
    {
        var userId = await RunAsDefaultUserAsync();

        var volume = await GenerateStackServiceVolume(
            StackServiceVolumeType.LocalMount,
            faker =>
                faker
                    .RuleFor(x => x.SourcePath, "/my/source")
                    .RuleFor(x => x.DestinationPath, "/my/destination")
        );
        await AssertVolumeCount(1);

        // refetch with relations
        var fetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume.Id,
            include =>
                include
                    .Include(x => x.StackService)
                    .ThenInclude(x => x.Stack)
                    .ThenInclude(x => x!.Environment)
                    .ThenInclude(x => x!.Project)
                    .ThenInclude(x => x!.Team)
        );
        fetchedVolume.Should().NotBeNull();

        if (attachUser)
        {
            await AddToTeam(fetchedVolume!.StackService.Stack!.Environment.Project.Team, userId);
        }

        Command = Command with
        {
            StackId = fetchedVolume!.StackService.StackId,
            StackServiceId = fetchedVolume.StackServiceId,
            Id = fetchedVolume.Id,
            Source = "dummy",
            Target = "/dummy",
            Type = StackServiceVolumeTypeDto.LocalMount,
        };

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () => await SendAsync(Command)
        );
    }
}
