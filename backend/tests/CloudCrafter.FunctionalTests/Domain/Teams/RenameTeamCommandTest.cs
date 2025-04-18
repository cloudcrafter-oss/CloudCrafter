using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Teams;
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

    [Test]
    public async Task ShouldNotBeAbleToRenameNonExistingTeam()
    {
        await RunAsAdministratorAsync();
        await AssertTeamCount(0);
        Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Command));

        await AssertTeamCount(0);
    }

    [Test]
    public async Task ShouldBeAbleToRenameExistingTeam()
    {
        var userId = await RunAsAdministratorAsync();
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
