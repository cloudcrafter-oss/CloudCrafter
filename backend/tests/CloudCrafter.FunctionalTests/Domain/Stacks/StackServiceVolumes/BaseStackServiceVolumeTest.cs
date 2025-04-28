using Bogus;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.StackServiceVolumes;

using static Testing;

public class BaseStackServiceVolumeTest : BaseTestFixture
{
    public async Task AssertVolumeCount(int count)
    {
        (await CountAsync<StackServiceVolume>()).Should().Be(count);
    }

    public Stack GetStack(Guid id)
    {
        var stackFromDb = FetchEntity<Stack>(
            q => q.Id == id,
            inc =>
                inc.Include(x => x.Environment).ThenInclude(x => x.Project).ThenInclude(x => x.Team)
        );

        return stackFromDb!;
    }

    public async Task<StackService> GenerateStackService(Guid? teamOwnerId = null)
    {
        var stack = await CreateSampleStack(null, teamOwnerId);

        var stackService = FakerInstances
            .StackServiceFaker(stack)
            // ReSharper disable once RedundantCast
            .RuleFor(x => x.Stack, f => (Stack?)null)
            .Generate();
        await AddAsync(stackService);

        return stackService;
    }

    public async Task<StackServiceVolume> GenerateStackServiceVolume(
        StackServiceVolumeType type,
        Action<Faker<StackServiceVolume>>? additionalRules = null,
        Guid? teamOwnerId = null
    )
    {
        var stack = await CreateSampleStack(null, teamOwnerId);

        var stackService = FakerInstances
            .StackServiceFaker(stack)
            // ReSharper disable once RedundantCast
            .RuleFor(x => x.Stack, f => (Stack?)null)
            .Generate();
        await AddAsync(stackService);

        var volumeFaker = FakerInstances
            .StackServiceVolumeFaker(stackService.Id)
            .RuleFor(x => x.Type, type)
            .RuleFor(
                x => x.SourcePath,
                f => type == StackServiceVolumeType.LocalMount ? f.Internet.UrlRootedPath() : null
            );

        additionalRules?.Invoke(volumeFaker);

        var volume = volumeFaker.Generate();
        await AddAsync(volume);

        return volume;
    }
}
