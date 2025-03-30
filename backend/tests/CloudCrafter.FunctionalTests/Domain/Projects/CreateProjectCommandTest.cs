using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;
using Environment = CloudCrafter.Domain.Entities.Environment;

namespace CloudCrafter.FunctionalTests.Domain.Projects;

using static Testing;

public class CreateProjectCommandTest : BaseTestFixture
{
    private CreateProjectCommand Command = new("Dummy");

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldBeAbleToCreateProject()
    {
        (await CountAsync<Project>()).Should().Be(0);

        await RunAsAdministratorAsync();

        var result = await SendAsync(Command);
        result.Name.Should().Be("Dummy");
        result.Id.Should().NotBeEmpty();

        (await CountAsync<Project>()).Should().Be(1);
    }

    [Test]
    public async Task ShouldCreateDefaultEnvironmentWhenCreatingProject()
    {
        (await CountAsync<Project>()).Should().Be(0);
        (await CountAsync<Environment>()).Should().Be(0);

        await RunAsAdministratorAsync();

        var result = await SendAsync(Command);
        result.Name.Should().Be("Dummy");

        (await CountAsync<Project>()).Should().Be(1);
        (await CountAsync<Environment>()).Should().Be(1);
    }
}
