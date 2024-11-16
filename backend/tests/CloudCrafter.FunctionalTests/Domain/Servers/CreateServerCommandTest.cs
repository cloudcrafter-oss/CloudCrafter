using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class CreateServerCommandTest : BaseTestFixture
{
    private CreateServerCommand.Command Command = new("");

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
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

    [Test]
    public async Task ShouldBeAbleToCreateServer()
    {
        Command = new CreateServerCommand.Command("My new server");

        await RunAsAdministratorAsync();

        (await CountAsync<Server>()).Should().Be(0);

        var result = await SendAsync(Command);

        result.Should().NotBeNull();

        result.Id.Should().NotBe(Guid.Empty);

        (await CountAsync<Server>()).Should().Be(1);

        var server = await FindAsync<Server>(result.Id);

        server.Should().NotBeNull();
        server!.Name.Should().Be(Command.Name);
    }
}
