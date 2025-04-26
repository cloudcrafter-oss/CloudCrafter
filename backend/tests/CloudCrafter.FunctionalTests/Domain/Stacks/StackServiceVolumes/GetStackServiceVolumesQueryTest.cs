using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.Volumes;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.StackServiceVolumes;

using static Testing;

public class GetStackServiceVolumesQueryTest : BaseStackServiceVolumeTest
{
    private readonly GetStackServiceVolumesQuery Query = new(Guid.NewGuid(), Guid.NewGuid());

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToFetchVolumesForNonExistingService(bool isAdmin)
    {
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            await RunAsDefaultUserAsync();
        }
        await AssertVolumeCount(0);

        var exception = Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Query));
        exception.Should().NotBeNull();
        exception.Message.Should().Be("Queried object Stack not found was not found, Key: Stack");
        await AssertVolumeCount(0);
    }

    [Test]
    public async Task ShouldNotBeAbleToFetchVolumesForStackServiceBecauseUserIsNotInTeam()
    {
        await RunAsDefaultUserAsync();

        var volume1 = await GenerateStackServiceVolume(StackServiceVolumeType.LocalMount);
        var volume2 = await GenerateStackServiceVolume(
            StackServiceVolumeType.DockerVolume,
            f => f.RuleFor(x => x.StackServiceId, volume1.StackServiceId)
        );

        var fetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume1.Id,
            inc =>
                inc.Include(x => x.StackService)
                    .ThenInclude(x => x.Stack)
                    .ThenInclude(x => x!.Environment)
                    .ThenInclude(x => x.Project)
                    .ThenInclude(x => x.Team)
        );

        Assert.ThrowsAsync<CannotAccessTeamException>(
            async () =>
                await SendAsync(
                    Query with
                    {
                        StackId = fetchedVolume!.StackService.StackId,
                        StackServiceId = fetchedVolume.StackServiceId,
                    }
                )
        );
    }

    [TestCase(true, false)]
    [TestCase(false, true)]
    [TestCase(false, false)]
    public async Task ShouldBeAbleToFetchVolumes(bool isAdmin, bool isTeamOwner)
    {
        Guid? teamOwner = null;
        Guid? userId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            userId = await RunAsDefaultUserAsync();

            if (isTeamOwner)
            {
                teamOwner = userId;
            }
        }

        await AssertVolumeCount(0);

        var volume1 = await GenerateStackServiceVolume(
            StackServiceVolumeType.LocalMount,
            null,
            teamOwner
        );
        var volume2 = await GenerateStackServiceVolume(
            StackServiceVolumeType.DockerVolume,
            f => f.RuleFor(x => x.StackServiceId, volume1.StackServiceId)
        );

        var fetchedVolume = FetchEntity<StackServiceVolume>(
            x => x.Id == volume1.Id,
            inc =>
                inc.Include(x => x.StackService)
                    .ThenInclude(x => x.Stack)
                    .ThenInclude(x => x!.Environment)
                    .ThenInclude(x => x.Project)
                    .ThenInclude(x => x.Team)
        );

        if (userId.HasValue)
        {
            await AddToTeam(fetchedVolume!.StackService.Stack!.Environment.Project.Team, userId);
        }

        var result = await SendAsync(
            Query with
            {
                StackId = fetchedVolume!.StackService.StackId,
                StackServiceId = fetchedVolume.StackServiceId,
            }
        );

        result.Should().HaveCount(2);
        ValidateVolumeDto(result.First(x => x.Id == volume1.Id), volume1);
        ValidateVolumeDto(result.First(x => x.Id == volume2.Id), volume2);
    }

    private void ValidateVolumeDto(StackServiceVolumeDto dto, StackServiceVolume volume)
    {
        dto.Id.Should().Be(volume.Id);
        dto.Name.Should().Be(volume.Name);
        ((int)dto.Type).Should().Be((int)volume.Type);
        dto.SourcePath.Should().Be(volume.SourcePath);
        dto.DestinationPath.Should().Be(volume.DestinationPath);
    }
}
