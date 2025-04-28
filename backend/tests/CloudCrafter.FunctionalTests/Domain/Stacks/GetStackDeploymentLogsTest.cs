using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class GetStackDeploymentLogsTest : BaseTestFixture
{
    private readonly GetStackDeploymentLogs.Query Query = new(Guid.NewGuid());

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldThrowErrorWhenNoAccessBecauseItDoesNotExists(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);

        var deploymentId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<Exception>(
            async () => await SendAsync(Query with { DeploymentId = deploymentId })
        );

        ex.Message.Should().Be($"Deployment with id {deploymentId} not found");
    }

    [TestCase]
    public async Task ShouldNotBeAbleToAccessLogsOfServerThatUserIsNotPartOf()
    {
        await RunAsDefaultUserAsync();

        var stack = await CreateSampleStack();

        var server = FakerInstances
            .ServerFaker.RuleFor(x => x.TeamId, stack.Environment.Project.Team.Id)
            .Generate();

        await AddAsync(server);

        var deployment = FakerInstances
            .DeploymentFaker(stack)
            .RuleFor(x => x.ServerId, server.Id)
            .RuleFor(
                x => x.Logs,
                f => new List<DeploymentLog>
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

        Assert.ThrowsAsync<CannotAccessTeamException>(
            async () => await SendAsync(Query with { DeploymentId = deployment.Id })
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToAccessDeploymentLogs(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var stack = await CreateSampleStack(null, !isAdmin ? userId : null);

        var server = FakerInstances
            .ServerFaker.RuleFor(x => x.TeamId, stack.Environment.Project.Team.Id)
            .Generate();

        await AddAsync(server);

        var deployment = FakerInstances
            .DeploymentFaker(stack)
            .RuleFor(x => x.ServerId, server.Id)
            .RuleFor(
                x => x.Logs,
                f => new List<DeploymentLog>
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

        var logs = await SendAsync(Query with { DeploymentId = deployment.Id });

        logs.Should().NotBeNull();
        logs.Count.Should().Be(1);
    }
}
