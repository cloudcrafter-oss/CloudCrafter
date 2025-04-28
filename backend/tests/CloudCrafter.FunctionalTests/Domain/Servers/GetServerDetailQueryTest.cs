using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class GetServerDetailQueryTest : BaseTestFixture
{
    private readonly GetServerDetailQuery Query = new(Guid.Empty);

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldReturnNullWhenNotFound()
    {
        await RunAsAdministratorAsync();

        var result = await SendAsync(new GetServerDetailQuery(Guid.NewGuid()));

        result.Should().BeNull();
    }

    [Test]
    public async Task ShouldNotBeAbleToAccessServerForDefaultUser()
    {
        await RunAsDefaultUserAsync();
        var server = FakerInstances.ServerFaker.Generate();

        await AddAsync(server);

        Assert.ThrowsAsync<CannotAccessTeamException>(
            async () => await SendAsync(new GetServerDetailQuery(server.Id))
        );
    }

    [Test]
    public async Task ShouldBeAbleToFetchServerDetails()
    {
        await RunAsAdministratorAsync();

        (await CountAsync<Server>()).Should().Be(0);
        var server = FakerInstances
            .ServerFaker.RuleFor(x => x.DockerNetwork, "my-custom-network")
            .Generate();

        await AddAsync(server);

        var result = await SendAsync(new GetServerDetailQuery(server.Id));

        result.Should().NotBeNull();
        result!.Id.Should().NotBe(Guid.Empty);
        result.AgentKey.Should().NotBeEmpty();
        result.DockerNetworkName.Should().Be("my-custom-network");
    }
}
