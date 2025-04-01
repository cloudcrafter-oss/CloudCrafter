using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.Volumes;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.StackServiceVolumes;

using static Testing;

public class GetStackServiceVolumesQueryTest : BaseStackServiceVolumeTest
{
    private GetStackServiceVolumesQuery Query { get; set; } = null!;

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldNotBeAbleToFetchVolumesForNonExistingService()
    {
        await RunAsAdministratorAsync();
        await AssertVolumeCount(0);

        var exception = Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Query));
        exception.Should().NotBeNull();
        exception
            .Message.Should()
            .Be("Queried object Stack service not found was not found, Key: StackService");
        await AssertVolumeCount(0);
    }

    [Test]
    public async Task ShouldBeAbleToFetchVolumes()
    {
        await RunAsAdministratorAsync();
        await AssertVolumeCount(0);

        var volume1 = await GenerateStackServiceVolume(StackServiceVolumeType.LocalMount);
        var volume2 = await GenerateStackServiceVolume(
            StackServiceVolumeType.DockerVolume,
            f => f.RuleFor(x => x.StackServiceId, volume1.StackServiceId)
        );

        var fetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume1.Id,
            inc => inc.Include(x => x.StackService)
        );

        Query = new GetStackServiceVolumesQuery(
            fetchedVolume!.StackService.StackId,
            fetchedVolume.StackServiceId
        );
        var result = await SendAsync(Query);

        result.Should().HaveCount(2);
        ValidateVolumeDto(result.First(x => x.Id == volume1.Id), volume1);
        ValidateVolumeDto(result.First(x => x.Id == volume2.Id), volume2);
    }

    private void ValidateVolumeDto(StackServiceVolumeDto dto, StackServiceVolume volume)
    {
        dto.Id.Should().Be(volume.Id);
        dto.Name.Should().Be(volume.Name);
        dto.Type.Should().Be(volume.Type);
        dto.SourcePath.Should().Be(volume.SourcePath);
        dto.DestinationPath.Should().Be(volume.DestinationPath);
    }
}
