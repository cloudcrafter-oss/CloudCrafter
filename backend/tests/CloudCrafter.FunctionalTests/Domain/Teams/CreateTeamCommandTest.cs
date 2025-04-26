using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using static CloudCrafter.FunctionalTests.Testing;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

public class CreateTeamCommandTest : BaseTeamTest
{
    private readonly CreateTeamCommand Command = new("Dummy");

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToCreateATeam(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);
        await AssertTeamCount(0);
        var teamId = await SendAsync(Command);
        teamId.Should().NotBeEmpty();

        var team = FetchEntity<Team>(x => x.Id == teamId);

        team.Should().NotBeNull();
        team!.OwnerId.Should().Be(userId!.Value);

        await AssertTeamCount(1);
    }
}
