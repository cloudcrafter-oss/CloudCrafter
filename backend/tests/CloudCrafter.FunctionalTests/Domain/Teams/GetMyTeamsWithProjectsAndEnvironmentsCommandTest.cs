﻿using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

using static Testing;

public class GetMyTeamsWithProjectsAndEnvironmentsCommandTest : BaseTeamTest
{
    private readonly GetMyTeamsWithProjectsAndEnvironmentsCommand Command = new();

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
        result[0].Projects.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldBeAbleToFetchTeamsWithEnvironments()
    {
        var userId = await RunAsAdministratorAsync();
        var emptyTeam = await CreateTeam(userId);
        var team = await CreateTeam(userId);
        var projects = FakerInstances.ProjectFaker.RuleFor(x => x.TeamId, team.Id).Generate(10);
        foreach (var project in projects)
        {
            await AddAsync(project);
            var environment = FakerInstances.EnvironmentFaker(project).Generate();
            await AddAsync(environment);
        }

        var result = await SendAsync(Command);

        result.Should().NotBeNull();
        result.Count.Should().Be(2);

        var emptyTeamResult = result.FirstOrDefault(x => x.Id == emptyTeam.Id);
        emptyTeamResult.Should().NotBeNull();
        emptyTeamResult!.Projects.Should().BeEmpty();

        var teamResult = result.FirstOrDefault(x => x.Id == team.Id);
        teamResult.Should().NotBeNull();
        teamResult!.Projects.Should().NotBeEmpty();
        teamResult.Projects!.Count().Should().Be(10);
        foreach (var project in teamResult.Projects)
        {
            project.Environments.Should().NotBeEmpty();
            project.Environments!.Count().Should().Be(1);
        }
    }
}
