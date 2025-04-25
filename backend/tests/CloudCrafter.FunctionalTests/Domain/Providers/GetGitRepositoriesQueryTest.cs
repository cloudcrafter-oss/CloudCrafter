using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Providers;

using static Testing;

public class GetGitRepositoriesQueryTest : ProviderBaseTest
{
    private readonly GetGitRepositoriesQuery Query = new(Guid.NewGuid());

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldThrowExceptionWhenProviderDoesNotExists()
    {
        await RunAsAdministratorAsync();

        Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldNotHaveAccessToProviderWhenNotAssignedToTeam()
    {
        await RunAsDefaultUserAsync();

        var githubProvider = FakerInstances.GithubProviderFaker().Generate();
        await AddAsync(githubProvider);

        var providerId = githubProvider.SourceProviderId;

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(Query with { ProviderId = providerId })
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToFetchRepositoriesGithubApp(bool isAdmin)
    {
        Team? team = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            var userId = await RunAsDefaultUserAsync();

            team = await CreateTeam(userId);
        }

        var provider = await CreateGithubSourceProvider(team?.Id);

        var result = await SendAsync(Query with { ProviderId = provider.Id });

        result.Count.Should().Be(1);
    }
}
