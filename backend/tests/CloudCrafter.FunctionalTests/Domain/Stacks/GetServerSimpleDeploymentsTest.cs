using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class GetServerSimpleDeploymentsTest : BaseTestFixture
{
    private readonly GetServerSimpleDeployments.Query Query = new(Guid.NewGuid(), new());

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

        var serverId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Query with { ServerId = serverId })
        );

        ex.Message.Should().Be($"User does not have access to server {serverId}");
    }

    [Test]
    public async Task ShouldNotBeAbleToFetchDeploymentsBecauseUserIsNotPartOfTeam()
    {
        await RunAsDefaultUserAsync();

        var team = await CreateTeam();
        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();
        await AddAsync(server);
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Query with { ServerId = server.Id })
        );

        ex.Message.Should().Be($"User does not have access to server {server.Id}");
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToFetchDeployments(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(!isAdmin ? userId : null);

        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();
        await AddAsync(server);
        var result = await SendAsync(
            new GetServerSimpleDeployments.Query(server.Id, new PaginatedRequest())
        );

        result.Result.Count.Should().Be(0);
    }
}
