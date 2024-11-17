using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class GetServerDetailQueryTest : BaseTestFixture
{
    private readonly GetServerDetail.Query Query = new(Guid.Empty);

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldReturnNullWhenNotFound()
    {
        await RunAsAdministratorAsync();

        var result = await SendAsync(new GetServerDetail.Query(Guid.NewGuid()));

        result.Should().BeNull();
    }

    [Test]
    public async Task ShouldBeAbleToFetchServerDetails()
    {
        await RunAsAdministratorAsync();

        (await CountAsync<Server>()).Should().Be(0);
        var server = FakerInstances.ServerFaker.Generate();

        await AddAsync(server);

        var result = await SendAsync(new GetServerDetail.Query(server.Id));

        result.Should().NotBeNull();
        result!.Id.Should().NotBe(Guid.Empty);
        result.AgentKey.Should().NotBeEmpty();
    }
}
