﻿using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

using static Testing;

public class DeleteTeamCommandTest : BaseTeamTest
{
    private readonly DeleteTeamCommand Command = new(Guid.NewGuid());

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDeleteANonExistingTeam(bool isAdmin)
    {
        await AssertTeamCount(0);
        await RunAsUserRoleAsync(isAdmin);

        Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToDeleteATeam(bool isAdmin)
    {
        await AssertTeamCount(0);
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = FakerInstances.TeamFaker().RuleFor(x => x.OwnerId, userId!.Value).Generate();

        await AddAsync(team);

        await AssertTeamCount(1);
        await SendAsync(new DeleteTeamCommand(TeamId: team.Id));
        await AssertTeamCount(0);
    }

    [Test]
    public async Task ShouldNotBeAbleToDeleteATeamOfWhichUserIsNotAnOwner()
    {
        var userId = await RunAsDefaultUserAsync();

        var team = await CreateTeam();

        await AssertTeamCount(1);
        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () => await SendAsync(Command with { TeamId = team.Id })
        );
        await AssertTeamCount(1);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDeleteATeamThatHasAProject(bool isAdmin)
    {
        await AssertTeamCount(0);
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = FakerInstances.TeamFaker().RuleFor(x => x.OwnerId, userId!.Value).Generate();

        await AddAsync(team);

        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        await AssertTeamCount(1);

        var exception = await FluentActions
            .Invoking(() => SendAsync(new DeleteTeamCommand(team.Id)))
            .Should()
            .ThrowAsync<ValidationException>();

        exception.WithMessage("One or more validation failures have occurred.");

        exception.And.Errors.Should().ContainKey("team");
        exception.And.Errors["team"].Should().HaveCount(1);
        exception.And.Errors["team"][0].Should().Be("Team has existing resources");

        (await CountAsync<Team>()).Should().Be(1);
        (await CountAsync<Project>()).Should().Be(1);
    }
}
