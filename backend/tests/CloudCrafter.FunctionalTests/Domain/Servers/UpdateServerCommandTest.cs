using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

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
    public async Task ShouldNotBeAbleToUpdateServerBecauseUserIsNotAnAdministrator()
    {
        await RunAsDefaultUserAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Command with { ServerId = server.Id })
        );
    }

    private async Task VerifyUpdateName(Guid serverId, string newName)
    {
        var updatedServer = await FindAsync<Server>(serverId);

        updatedServer.Should().NotBeNull();
        updatedServer!.Name.Should().Be(newName);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToPatchName(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(userId);

        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();
        await AddAsync(server);

        var command = new UpdateServerCommand(server.Id, new UpdateServerDto { Name = "New Name" });
        server.Name.Should().NotBe(command.UpdateDetails.Name);

        await SendAsync(command);

        await VerifyUpdateName(server.Id, command.UpdateDetails.Name!);
    }

    [Test]
    public async Task ShouldNotBeAbleToUpdateServerBecauseUserIsNotATeamOwner()
    {
        var userId = await RunAsDefaultUserAsync();
        var team = await CreateTeam();
        await AddToTeam(team, userId);

        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, f => team.Id).Generate();
        await AddAsync(server);

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () =>
                await SendAsync(
                    new UpdateServerCommand(server.Id, new UpdateServerDto { Name = "New Name" })
                )
        );
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
