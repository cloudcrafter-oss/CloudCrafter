using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

using static Testing;

public class RenameTeamCommandTest : BaseTeamTest
{
    private readonly RenameTeamCommand Command = new RenameTeamCommand()
    {
        Id = Guid.NewGuid(),
        Name = "New name",
    };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToRenameNonExistingTeam(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);
        await AssertTeamCount(0);
        Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Command));

        await AssertTeamCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToRenameNonExistingTeamBecauseNotOwner(bool attachToTeam)
    {
        var userId = await RunAsDefaultUserAsync();

        var team = await CreateTeam();
        if (attachToTeam)
        {
            await AddToTeam(team, userId);
        }

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () => await SendAsync(Command with { Id = team.Id, Name = "Some name" })
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToRenameExistingTeamAsOwner(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);
        await AssertTeamCount(0);

        var teamFaker = FakerInstances
            .TeamFaker()
            .RuleFor(x => x.OwnerId, userId!.Value)
            .Generate();

        await AddAsync(teamFaker);

        await SendAsync(Command with { Id = teamFaker.Id, Name = "Some name" });

        var team = await FindAsync<Team>(teamFaker.Id);
        team.Should().NotBeNull();
        team!.Name.Should().Be("Some name");

        await AssertTeamCount(1);
    }
}
