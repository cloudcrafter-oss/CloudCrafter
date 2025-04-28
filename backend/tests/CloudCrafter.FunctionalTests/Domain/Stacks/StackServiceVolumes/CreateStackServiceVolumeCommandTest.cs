using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.Volumes;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.StackServiceVolumes;

using static Testing;

public class CreateStackServiceVolumeCommandTest : BaseStackServiceVolumeTest
{
    private CreateStackServiceVolumeCommand Command =
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
    public async Task ShouldNotBeAbleToCreateVolumeWithSourceWhenUsingDockerVolume(bool isAdmin)
    {
        await AssertVolumeCount(0);

        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        var stackService = await GenerateStackService(ownerId);

        Command = Command with
        {
            StackId = stackService.StackId,
            StackServiceId = stackService.Id,
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

        await AssertVolumeCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToCreateVolumeOnNonExistingService(bool isAdmin)
    {
        await AssertVolumeCount(0);
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        var stackService = await GenerateStackService(ownerId);

        Command = Command with
        {
            StackId = stackService.StackId,
            StackServiceId = Guid.NewGuid(),
            Source = "dummy",
            Target = "/dummy",
            Type = StackServiceVolumeTypeDto.LocalMount,
        };

        var exception = Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Command));
        exception.Should().NotBeNull();
        exception
            .Message.Should()
            .Be("Queried object Stack service not found was not found, Key: StackService");
        await AssertVolumeCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToCreateDockerVolume(bool isAdmin)
    {
        await AssertVolumeCount(0);
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        var stackService = await GenerateStackService(ownerId);

        Command = Command with
        {
            StackId = stackService.StackId,
            StackServiceId = stackService.Id,
            Source = null,
            Target = "/dummy",
            Type = StackServiceVolumeTypeDto.DockerVolume,
        };

        var result = await SendAsync(Command);
        result.Should().NotBe(Guid.Empty);

        var volume = await FindAsync<StackServiceVolume>(result);
        volume.Should().NotBeNull();

        volume!.Name.Should().Be("dummy");
        volume.Type.Should().Be(StackServiceVolumeType.DockerVolume);
        volume.SourcePath.Should().BeNull();
        volume.DestinationPath.Should().Be("/dummy");
        volume.StackServiceId.Should().Be(stackService.Id);

        await AssertVolumeCount(1);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToCreateVolumeBecauseUserHasNotCorrectRoleInTeam(
        bool attachToTeam
    )
    {
        await AssertVolumeCount(0);

        var userId = await RunAsDefaultUserAsync();

        var stackService = await GenerateStackService();

        var stackFromDb = GetStack(stackService.StackId);

        if (attachToTeam)
        {
            await AddToTeam(stackFromDb.Environment.Project.Team, userId);
        }

        Command = Command with
        {
            StackId = stackService.StackId,
            StackServiceId = stackService.Id,
            Source = null,
            Target = "/dummy",
            Type = StackServiceVolumeTypeDto.DockerVolume,
        };

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () => await SendAsync(Command)
        );
    }
}
