using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

using static Testing;

public class RemoveMemberFromTeamCommandTest : BaseTeamTest
{
    private readonly RemoveMemberFromTeamCommand Command =
        new() { TeamId = Guid.NewGuid(), Email = "dummy" };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDeleteUserBecauseTeamDoesNotExists(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);

        Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDeleteUserBecauseCurrentUserHasNotEnoughPermissions(
        bool attachToTeam
    )
    {
        var userId = await RunAsDefaultUserAsync();
        var team = await CreateTeam();

        if (attachToTeam)
        {
            await AddToTeam(team, userId);
        }

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () => await SendAsync(Command with { TeamId = team.Id })
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToRemoveUserToTeamButUserDoesNotExists(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(!isAdmin ? userId : null);

        var user = await AddToTeam(team);

        (await CountAsync<TeamUser>()).Should().Be(1);

        await SendAsync(Command with { TeamId = team.Id, Email = "aaa" + user.Email! });

        (await CountAsync<TeamUser>()).Should().Be(1);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToRemoveUserToTeam(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(!isAdmin ? userId : null);

        var user = await AddToTeam(team);

        (await CountAsync<TeamUser>()).Should().Be(1);

        await SendAsync(Command with { TeamId = team.Id, Email = user.Email! });

        (await CountAsync<TeamUser>()).Should().Be(0);
    }
}
