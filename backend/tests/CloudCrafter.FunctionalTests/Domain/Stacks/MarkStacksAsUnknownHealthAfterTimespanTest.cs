using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class MarkStacksAsUnknownHealthAfterTimespanTest : BaseTestFixture
{
    [Test]
    public async Task ShouldNotUpdateDatesButShouldMarkThemUnhealthy()
    {
        var yesterday = DateTime.UtcNow.AddDays(-1);
        var stack = await CreateSampleStack(x =>
        {
            x.HealthStatus.StatusAt = yesterday;
            x.HealthStatus.Value = EntityHealthStatusValue.Healthy;
        });

        var stackService = FakerInstances
            .StackServiceFaker(stack)
            .RuleFor(x => x.Stack, (Stack?)null)
            .RuleFor(
                x => x.HealthStatus,
                f => new EntityStackServiceHealthStatus
                {
                    StatusAt = yesterday,
                    Value = EntityHealthStatusValue.Healthy,
                    IsRunning = true,
                }
            )
            .Generate();
        await AddAsync(stackService);

        await SendAsync(new MarkStacksAsUnknownHealthAfterTimespan.Command());

        var stackFromDb = await FindAsync<Stack>(stack.Id);
        stackFromDb.Should().NotBeNull();

        stackFromDb!
            .HealthStatus.StatusAt.Should()
            .BeCloseTo(yesterday, TimeSpan.FromMilliseconds(1));
        stackFromDb.HealthStatus.Value.Should().Be(EntityHealthStatusValue.HealthCheckOverdue);

        var serviceFromDb = await FindAsync<StackService>(stackService.Id);
        serviceFromDb.Should().NotBeNull();

        serviceFromDb!.HealthStatus.StatusAt.Should().Be(yesterday);
        serviceFromDb.HealthStatus.Value.Should().Be(EntityHealthStatusValue.HealthCheckOverdue);
    }
}
