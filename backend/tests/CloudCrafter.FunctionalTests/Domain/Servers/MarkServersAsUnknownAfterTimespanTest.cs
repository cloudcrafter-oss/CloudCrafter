using CloudCrafter.Core.Commands.Providers;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class MarkServersAsUnknownAfterTimespanTest : BaseTestFixture
{
    [Test]
    public async Task ShouldSetServersToUnknownStateAfterTimespan()
    {
        // Arrange
        var server = FakerInstances
            .ServerFaker.RuleFor(
                x => x.PingHealthData,
                f => new ServerPingData
                {
                    LastPingAt = DateTime.UtcNow.AddMinutes(-10),
                    Status = ServerStatusValue.Connected,
                }
            )
            .Generate();

        await AddAsync(server);

        // Act
        await SendAsync(new ValidateProvidersCommand.Command());

        // Assert
        var serverAfter = FetchEntity<Server>(f => f.Id == server!.Id)!;

        serverAfter.PingHealthData.Status.Should().Be(ServerStatusValue.Unknown);
    }
}
