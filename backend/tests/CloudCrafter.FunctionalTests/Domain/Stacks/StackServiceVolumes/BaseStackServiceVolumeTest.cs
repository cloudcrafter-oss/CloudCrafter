using Bogus;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.StackServiceVolumes;

using static Testing;

public class BaseStackServiceVolumeTest : BaseTestFixture
{
    public async Task AssertVolumeCount(int count)
    {
        (await CountAsync<StackServiceVolume>()).Should().Be(count);
    }

    public async Task<StackService> GenerateStackService()
    {
        var stack = await CreateSampleStack();

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
        Action<Faker<StackServiceVolume>>? additionalRules = null
    )
    {
        var stack = await CreateSampleStack();

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
