using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using Npgsql;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class UpdateServerCommandTest : BaseTestFixture
{
    private readonly UpdateServerCommand Command = new(Guid.Empty, new UpdateServerDto());

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldThrowErrorWhenNoAccessBecauseItDoesNotExists()
    {
        await RunAsAdministratorAsync();

        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Command)
        );

        ex.Message.Should().Be($"User does not have access to server {Guid.Empty}");
    }

    [Test]
    public async Task ShouldBeAbleToPatchName()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        var command = new UpdateServerCommand(server.Id, new UpdateServerDto { Name = "New Name" });
        server.Name.Should().NotBe(command.UpdateDetails.Name);

        await SendAsync(command);

        var updatedServer = await FindAsync<Server>(server.Id);

        updatedServer.Should().NotBeNull();
        updatedServer!.Name.Should().Be(command.UpdateDetails.Name);
    }

    [Test]
    public async Task ShouldBeAbleToPatchDockerNetwork()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        var command = new UpdateServerCommand(
            server.Id,
            new UpdateServerDto { DockerNetwork = "another-network" }
        );
        server.DockerNetwork.Should().NotBe(command.UpdateDetails.DockerNetwork);

        await SendAsync(command);

        var updatedServer = await FindAsync<Server>(server.Id);

        updatedServer.Should().NotBeNull();
        updatedServer!.DockerNetwork.Should().Be(command.UpdateDetails.DockerNetwork);
        updatedServer.Name.Should().Be(server.Name);
    }

    [Test]
    public async Task? ShouldBeAbleToPatchNothing()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        var command = new UpdateServerCommand(server.Id, new UpdateServerDto());
        server.Name.Should().NotBe(command.UpdateDetails.Name);

        await SendAsync(command);

        var updatedServer = await FindAsync<Server>(server.Id);

        updatedServer.Should().NotBeNull();
        updatedServer!.Name.Should().Be(server.Name);
        updatedServer.DockerNetwork.Should().Be(server.DockerNetwork);
    }
}
