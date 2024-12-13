using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Providers;

using static Testing;

public class GetProvidersQueryTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetProvidersQuery.Query(new ProviderFilterRequest()))
        );
    }

    [Test]
    public async Task ShouldBeAbleToFetchProvidersList()
    {
        await RunAsAdministratorAsync();
        (await CountAsync<GithubProvider>()).Should().Be(0);

        for (int i = 0; i < 10; i++)
        {
            var createdProvider = FakerInstances.GithubProviderFaker.Generate();
            await AddAsync(createdProvider);
        }

        var result = await SendAsync(new GetProvidersQuery.Query(new ProviderFilterRequest()));
        result.Count().Should().Be(10);

        foreach (var provider in result)
        {
            provider.Github.Should().NotBeNull();
            provider.Github!.Name.Should().NotBeNull();
            provider.Name.Should().NotBeNullOrEmpty();
            provider.Id.Should().NotBe(Guid.Empty);
        }
    }
}
