using CloudCrafter.Core.Commands.Teams;
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

    [Test]
    public async Task ShouldBeAbleToCreateATeam()
    {
        await RunAsAdministratorAsync();
        await AssertTeamCount(0);
        var teamId = await SendAsync(Command);
        teamId.Should().NotBeEmpty();
        await AssertTeamCount(1);
    }
}
