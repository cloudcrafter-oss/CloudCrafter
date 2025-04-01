using CloudCrafter.Core.Commands.Stacks.Volumes;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

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
            Type = StackServiceVolumeType.DockerVolume,
            Source = null,
            Target = "/dummy",
        };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldNotBeAbleToCreateVolumeWithSourceWhenUsingDockerVolume()
    {
        await AssertVolumeCount(0);
        await RunAsAdministratorAsync();

        var stackService = await GenerateStackService();

        Command = Command with
        {
            StackId = stackService.StackId,
            StackServiceId = stackService.Id,
            Source = "dummy",
            Target = "/dummy",
            Type = StackServiceVolumeType.DockerVolume,
        };

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(Command)
        );
        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("Source").And.HaveCount(1);
        exception!.Errors["Source"].Should().Contain("Source can only be used with LocalVolumes");

        await AssertVolumeCount(0);
    }

    [Test]
    public async Task ShouldBeAbleToCreateDockerVolume()
    {
        await AssertVolumeCount(0);
        await RunAsAdministratorAsync();

        var stackService = await GenerateStackService();

        Command = Command with
        {
            StackId = stackService.StackId,
            StackServiceId = stackService.Id,
            Source = null,
            Target = "/dummy",
            Type = StackServiceVolumeType.DockerVolume,
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
}
