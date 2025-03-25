using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;
using NUnit.Framework;

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

        var serverFromDb = FetchEntity<Server>(x => x.Id == server.Id);

        serverFromDb.Should().NotBeNull();
        server.AgentSecretKey.Should().NotBeEmpty();
        serverFromDb!.AgentSecretKey.Should().NotBe(server.AgentSecretKey);
    }
}
