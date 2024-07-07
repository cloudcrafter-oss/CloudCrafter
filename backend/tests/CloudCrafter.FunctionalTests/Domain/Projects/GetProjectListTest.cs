using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Projects;

using static Testing;
public class GetProjectListTest : BaseTestFixture
{
    private GetProjectList.Query Query = new();
    
    
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

        var projects = FakerInstances.ProjectFaker.Generate(10);
        foreach (var project in projects)
        {
            await AddAsync(project);
        }
        
        var result = await SendAsync(Query);
        result.Count().Should().Be(10);
    }

}
