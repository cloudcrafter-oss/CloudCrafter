using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class GetStackDeploymentLogsTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetStackDeploymentLogs.Query(Guid.NewGuid()))
        );
    }

    [Test]
    [Ignore("TODO: ACL check not yet implemented")]
    public async Task ShoulThrowErrorWhenNoAccessBecauseItDoesNotExists()
    {
        await RunAsAdministratorAsync();

        var deploymentId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetStackDeploymentLogs.Query(deploymentId))
        );

        ex.Message.Should().Be($"User does not have access to stack {deploymentId}");
    }

    [Test]
    public async Task ShouldBeAbleToAccessDeploymentLogs()
    {
        await RunAsAdministratorAsync();

        var stack = await CreateSampleStack();

        var deployment = FakerInstances
            .DeploymentFaker(stack)
            .RuleFor(
                x => x.Logs,
                f =>
                    new()
                    {
                        new()
                        {
                            Date = DateTime.UtcNow,
                            Log = "Hello!",
                            Index = 0,
                            Level = ChannelOutputLogLineLevel.Information,
                        },
                    }
            )
            .Generate();
        await AddAsync(deployment);

        var logs = await SendAsync(new GetStackDeploymentLogs.Query(deployment.Id));

        logs.Should().NotBeNull();
        logs.Count.Should().Be(1);
    }
}
