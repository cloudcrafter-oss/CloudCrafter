using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Projects;

using static Testing;
public class CreateProjectCommandTest : BaseTestFixture
{
    private CreateProjectCommand.Command Command = new("Dummy");
    
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
}
