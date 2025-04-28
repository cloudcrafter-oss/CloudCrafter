using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Teams;
using FluentAssertions;
using Polly.Caching;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

using static Testing;

public class GetTeamUsersCommandTest : BaseTeamTest
{
    private readonly GetTeamUsersCommand Command = new(Guid.NewGuid(), new());

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToFetchUsersForNonExistingTeam(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(Command with { TeamId = Guid.NewGuid() })
        );
    }

    [TestCase(true, false, false)]
    [TestCase(false, true, false)]
    [TestCase(false, false, true)]
    public async Task ShouldBeAbleToFetchUsersForTeam(
        bool isAdmin,
        bool isTeamOwner,
        bool attachToTeam
    )
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(isTeamOwner ? userId : null);

        if (attachToTeam)
        {
            await AddToTeam(team, userId);
        }

        int addUsers = 10;

        await AddToTeam(team, addUsers);

        int expected = attachToTeam ? addUsers + 1 : addUsers;

        var result = await SendAsync(Command with { TeamId = team.Id });

        result.Should().NotBeNull();

        result.Result.Count.Should().Be(10);
        result.TotalItems.Should().Be(expected);
    }
}
