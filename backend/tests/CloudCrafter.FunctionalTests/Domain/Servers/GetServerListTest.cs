using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Servers;

using static Testing;

public class GetServerListTest : BaseTestFixture
{
    private GetServerListQuery Query = new();

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldBeAbleToFetchServersWhenLoggedIn()
    {
        await RunAsAdministratorAsync();

        var servers = FakerInstances.ServerFaker.Generate(5);
        foreach (var server in servers)
        {
            await AddAsync(server);
        }

        var result = await SendAsync(Query);

        result.Count.Should().Be(5);
    }
}
