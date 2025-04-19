using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Projects;

using static Testing;

public class GetProjectListTest : BaseTestFixture
{
    private GetProjectListQuery Query = new(false);

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldBeAbleToFetchProjects()
    {
        await RunAsAdministratorAsync();

        (await CountAsync<Project>()).Should().Be(0);

        var team = await CreateTeam();
        var projects = FakerInstances.ProjectFaker(team.Id).Generate(10);
        foreach (var project in projects)
        {
            await AddAsync(project);
            var environment = FakerInstances.EnvironmentFaker(project).Generate();
            await AddAsync(environment);
        }

        var result = await SendAsync(Query);
        result.Count().Should().Be(10);

        foreach (var project in result)
        {
            project.Environments.Should().BeEmpty();
        }
    }

    [Test]
    public async Task ShouldBeAbleToFetchProjectsWithEnvironments()
    {
        await RunAsAdministratorAsync();
        (await CountAsync<Project>()).Should().Be(0);

        var team = await CreateTeam();
        var projects = FakerInstances.ProjectFaker(team.Id).Generate(10);
        foreach (var project in projects)
        {
            await AddAsync(project);
            var environment = FakerInstances.EnvironmentFaker(project).Generate();
            await AddAsync(environment);
        }

        Query = new GetProjectListQuery(true);

        var result = await SendAsync(Query);

        foreach (var project in result)
        {
            project.Environments.Should().NotBeEmpty();
            project.Environments!.Count().Should().Be(1);
        }
    }
}
