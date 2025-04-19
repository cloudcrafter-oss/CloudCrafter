using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using static CloudCrafter.FunctionalTests.Testing;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

public class GetMyTeamsCommandTest : BaseTeamTest
{
    private readonly GetMyTeamsCommand Command = new();

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldBeAbleToFetchNoTeamsWhenNonOwnedOrAssigned()
    {
        await RunAsAdministratorAsync();
        await AssertTeamCount(0);

        var result = await SendAsync(Command);

        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldBeAbleToFetchTeamsWhenOwned()
    {
        var userId = await RunAsAdministratorAsync();
        await AssertTeamCount(0);

        var teamFaker = FakerInstances
            .TeamFaker()
            .RuleFor(x => x.OwnerId, userId!.Value)
            .Generate();

        await AddAsync(teamFaker);

        var result = await SendAsync(Command);
        result.Should().NotBeNull();
        result.Count.Should().Be(1);
        result[0].Id.Should().Be(teamFaker.Id);
    }

    [Test]
    public async Task ShouldBeAbleToFetchTeamsWhenAssigned()
    {
        var userId = await RunAsAdministratorAsync();
        await AssertTeamCount(0);

        var randomUser = FakerInstances.UserFaker.Generate();
        await AddAsync(randomUser);

        var teamFaker = FakerInstances
            .TeamFaker()
            .RuleFor(x => x.OwnerId, randomUser.Id)
            .Generate(10)
            .ToList();

        foreach (var team in teamFaker)
        {
            await AddAsync(team);
            await AddAsync(new TeamUser() { UserId = userId!.Value, TeamId = team.Id });
        }

        var result = await SendAsync(Command);
        result.Should().NotBeNull();
        result.Count.Should().Be(10);
    }
}
