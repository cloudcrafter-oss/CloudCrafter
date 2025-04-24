using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class RotateServerKeyCommandTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new RotateServerKeyCommand(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShouldThrowExceptionIfServerDoesNotExists()
    {
        await RunAsAdministratorAsync();

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(new RotateServerKeyCommand(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShouldBeAbleToRotateServerKey()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        await SendAsync(new RotateServerKeyCommand(server.Id));

        VerifyServerRotation(server);
    }

    private void VerifyServerRotation(Server server)
    {
        var serverFromDb = FetchEntity<Server>(x => x.Id == server.Id);

        serverFromDb.Should().NotBeNull();
        server.AgentSecretKey.Should().NotBeEmpty();
        serverFromDb!.AgentSecretKey.Should().NotBe(server.AgentSecretKey);
    }

    [Test]
    public async Task ShouldNotBeAbleToRotateServerKeyWhenNotAnAdministratorAndNoTeamToServer()
    {
        await RunAsDefaultUserAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        Assert.ThrowsAsync<ForbiddenAccessException>(
            async () => await SendAsync(new RotateServerKeyCommand(server.Id))
        );
    }

    [Test]
    public async Task ShouldBeAbleToRotateServerKeyWhenTeamOwner()
    {
        var userId = await RunAsDefaultUserAsync();
        var team = await CreateTeam(userId);
        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();

        await AddAsync(server);

        await SendAsync(new RotateServerKeyCommand(server.Id));

        VerifyServerRotation(server);
    }

    [Test]
    public async Task ShouldNotBeAbleToRotateServerKeyWhenAttachedToTeam()
    {
        var userId = await RunAsDefaultUserAsync();
        var team = await CreateTeam();
        await AddToTeam(team, userId);

        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();

        await AddAsync(server);
        Assert.ThrowsAsync<ForbiddenAccessException>(
            async () => await SendAsync(new RotateServerKeyCommand(server.Id))
        );
    }
}
