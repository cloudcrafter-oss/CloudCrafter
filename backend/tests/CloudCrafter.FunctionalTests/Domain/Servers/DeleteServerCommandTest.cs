using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class DeleteServerCommandTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new DeleteServerCommand(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShouldNotBeAbleToDeleteServerWhichUserDoesNotHaveAccessTo()
    {
        await RunAsDefaultUserAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        (await CountAsync<Server>()).Should().Be(1);

        Assert.ThrowsAsync<ForbiddenAccessException>(
            async () => await SendAsync(new DeleteServerCommand(server.Id))
        );

        (await CountAsync<Server>()).Should().Be(1);
    }

    [Test]
    public async Task ShouldExecuteEvenIfServerDoesNotExists()
    {
        await RunAsAdministratorAsync();

        await SendAsync(new DeleteServerCommand(Guid.NewGuid()));

        (await CountAsync<Server>()).Should().Be(0);
    }

    [Test]
    public async Task ShouldDeleteServer()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        (await CountAsync<Server>()).Should().Be(1);
        await SendAsync(new DeleteServerCommand(server.Id));

        (await CountAsync<Server>()).Should().Be(0);
    }

    [Test]
    public async Task ShouldNotDeleteOtherServers()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        (await CountAsync<Server>()).Should().Be(1);
        await SendAsync(new DeleteServerCommand(Guid.NewGuid()));

        (await CountAsync<Server>()).Should().Be(1);
    }

    [Test]
    public async Task ShouldNotBeAbleToDeleteServerBecauseItHasStacksAttached()
    {
        await RunAsAdministratorAsync();
        (await CountAsync<Server>()).Should().Be(0);
        var stack = await CreateSampleStack();

        var serverId = stack.ServerId;
        (await CountAsync<Stack>()).Should().Be(1);
        (await CountAsync<Server>()).Should().Be(1);

        var exception = await FluentActions
            .Invoking(() => SendAsync(new DeleteServerCommand(serverId)))
            .Should()
            .ThrowAsync<ValidationException>();

        exception.WithMessage("One or more validation failures have occurred.");

        exception.And.Errors.Should().ContainKey("server");
        exception.And.Errors["server"].Should().HaveCount(1);
        exception.And.Errors["server"][0].Should().Be("Server has existing resources");

        (await CountAsync<Stack>()).Should().Be(1);
        (await CountAsync<Server>()).Should().Be(1);
    }
}
