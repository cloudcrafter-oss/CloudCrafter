using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

using static Testing;

public class InviteUserToTeamWriteCommandTest : BaseTeamTest
{
    private readonly InviteUserToTeamWriteCommand Command =
        new() { Email = "dummy", TeamId = Guid.NewGuid() };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToInviteUserBecauseTeamDoesNotExists(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);

        Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToInviteUserBecauseCurrentUserHasNotEnoughPermissions(
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
    public async Task ShouldBeAbleToInviteUserToTeamButUserDoesNotExists(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(!isAdmin ? userId : null);

        (await CountAsync<TeamUser>()).Should().Be(0);

        await SendAsync(Command with { TeamId = team.Id });

        (await CountAsync<TeamUser>()).Should().Be(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToInviteUserToTeam(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(!isAdmin ? userId : null);

        var user = FakerInstances.UserFaker.Generate();

        user.Email.Should().NotBeEmpty();
        await AddAsync(user);

        (await CountAsync<TeamUser>()).Should().Be(0);

        await SendAsync(Command with { TeamId = team.Id, Email = user.Email! });

        (await CountAsync<TeamUser>()).Should().Be(1);

        var teamUser = FetchEntity<TeamUser>(x => x.TeamId == team.Id && x.UserId == user.Id);
        teamUser.Should().NotBeNull();
    }
}
