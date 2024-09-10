using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Projects;

using static Testing;

public class GetProjectQueryTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetProjectQuery.Query(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShouldReceiveNullWhenProjectDoesNotExists()
    {
        await RunAsAdministratorAsync();

        (await CountAsync<Project>()).Should().Be(0);

        var result = await SendAsync(new GetProjectQuery.Query(Guid.NewGuid()));
        result.Should().BeNull();
    }

    [Test]
    public async Task ShouldBeAbleToFetchProject()
    {
        await RunAsAdministratorAsync();

        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var result = await SendAsync(new GetProjectQuery.Query(project.Id));
        result.Should().NotBeNull();
        result!.Id.Should().Be(project.Id);
    }
}
