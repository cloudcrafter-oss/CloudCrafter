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
}
