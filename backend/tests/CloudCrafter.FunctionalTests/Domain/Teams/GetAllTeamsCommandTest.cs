using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

using static Testing;

public class GetAllTeamsCommandTest : BaseTeamTest
{
    private readonly GetAllTeamsCommand Command = new();

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldThrowExceptionWhenUserIsNotAnAdministrator()
    {
        await RunAsDefaultUserAsync();

        Assert.ThrowsAsync<ForbiddenAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldBeAbleToFetchTeamsEmpty()
    {
        await RunAsAdministratorAsync();
        await AssertTeamCount(0);

        var result = await SendAsync(Command);

        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldBeAbleToFetchTeams()
    {
        await RunAsAdministratorAsync();
        await AssertTeamCount(0);

        var user = FakerInstances.UserFaker.Generate();
        await AddAsync(user);

        var teams = FakerInstances.TeamFaker().RuleFor(x => x.OwnerId, user.Id).Generate(10);

        await AddAsyncList(teams);

        var result = await SendAsync(Command);
        result.Should().NotBeNull();
        result.Count.Should().Be(10);
    }
}
