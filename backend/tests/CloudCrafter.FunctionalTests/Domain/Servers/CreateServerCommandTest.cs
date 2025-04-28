using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class CreateServerCommandTest : BaseTestFixture
{
    private readonly CreateServerCommand Command = new("");

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldNotBeAbleToCreateAServerAsDefaultUserWithoutATeam()
    {
        await RunAsDefaultUserAsync();

        Assert.ThrowsAsync<ForbiddenAccessException>(
            async () => await SendAsync(Command with { Name = "Dummy", TeamId = null })
        );
    }

    [Test]
    public async Task ShouldNotBeAbleToCreateServerBecauseValidationFails()
    {
        await RunAsAdministratorAsync();

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(Command)
        );

        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("Name").And.HaveCount(1);
        exception!.Errors["Name"].Should().Contain("'Name' must not be empty.");
        exception!
            .Errors["Name"]
            .Should()
            .Contain(
                "The length of 'Name' must be at least 3 characters. You entered 0 characters."
            );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToCreateServer(bool isAdmin)
    {
        Team? team = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            var userId = await RunAsDefaultUserAsync();

            team = await CreateTeam(userId!.Value);
        }

        (await CountAsync<Server>()).Should().Be(0);

        var result = await SendAsync(
            new CreateServerCommand("My new server") { TeamId = team?.Id }
        );

        result.Should().NotBeNull();

        result.Id.Should().NotBe(Guid.Empty);

        (await CountAsync<Server>()).Should().Be(1);

        var server = await FindAsync<Server>(result.Id);

        server.Should().NotBeNull();
        server!.Name.Should().Be("My new server");

        if (isAdmin)
        {
            server.TeamId.Should().BeNull();
        }
        else
        {
            server.TeamId.Should().Be(team!.Id);
        }
    }
}
