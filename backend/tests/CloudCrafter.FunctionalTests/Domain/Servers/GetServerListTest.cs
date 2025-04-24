using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class GetServerListTest : BaseTestFixture
{
    private readonly GetServerListQuery Query = new();

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [TestCase(true, 5, 5)]
    [TestCase(false, 5, 0)]
    public async Task ShouldBeAbleToFetchServersWhenLoggedIn(
        bool isAdmin,
        int generate,
        int expected
    )
    {
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            await RunAsDefaultUserAsync();
        }

        var servers = FakerInstances.ServerFaker.Generate(generate);
        foreach (var server in servers)
        {
            await AddAsync(server);
        }

        var result = await SendAsync(Query);

        result.Count.Should().Be(expected);
    }

    [Test]
    public async Task ShouldBeAbleToSeeOwnedTeamServer()
    {
        var userId = await RunAsDefaultUserAsync();

        var team = await CreateTeam(userId);

        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();
        await AddAsync(server);

        var result = await SendAsync(Query);

        result.Count.Should().Be(1);
    }

    [Test]
    public async Task ShouldBeAbleToAttachedTeamServer()
    {
        var userId = await RunAsDefaultUserAsync();

        var team = await CreateTeam();
        await AddToTeam(team, userId);

        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();

        await AddAsync(server);

        var result = await SendAsync(Query);
        result.Count.Should().Be(1);
    }
}
