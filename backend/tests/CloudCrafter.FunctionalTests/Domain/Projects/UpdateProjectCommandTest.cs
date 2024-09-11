using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Projects;

using static Testing;

public class UpdateProjectCommandTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () =>
                await SendAsync(
                    new UpdateProjectCommand.Command(Guid.NewGuid(), new UpdateProjectArgs())
                )
        );
    }

    [Test]
    public async Task ShouldBeAbleToUpdateJustTheName()
    {
        await RunAsAdministratorAsync();

        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var args = new UpdateProjectArgs { Name = "New Name" };
        var result = await SendAsync(new UpdateProjectCommand.Command(project.Id, args));

        result.Name.Should().Be("New Name");
        result.Description.Should().Be(project.Description);
    }

    [Test]
    public async Task ShouldBeAbleToUpdateJustTheDescription()
    {
        await RunAsAdministratorAsync();

        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var args = new UpdateProjectArgs { Description = "New Description" };
        var result = await SendAsync(new UpdateProjectCommand.Command(project.Id, args));

        result.Name.Should().Be(project.Name);
        result.Description.Should().Be("New Description");
    }
}
