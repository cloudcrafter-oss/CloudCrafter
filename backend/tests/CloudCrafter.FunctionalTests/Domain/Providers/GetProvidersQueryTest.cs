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
    private readonly GetProvidersQuery.Query Query = new GetProvidersQuery.Query(
        new ProviderFilterRequest()
    );

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [TestCase(true, 5, 5)]
    [TestCase(false, 5, 0)]
    public async Task ShouldBeAbleToFetchProvidersList(bool isAdmin, int generate, int expected)
    {
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            await RunAsDefaultUserAsync();
        }

        (await CountAsync<GithubProvider>()).Should().Be(0);

        for (int i = 0; i < generate; i++)
        {
            var createdProvider = FakerInstances.GithubProviderFaker.Generate();
            await AddAsync(createdProvider);
        }

        var result = await SendAsync(Query);
        result.Count().Should().Be(expected);

        foreach (var provider in result)
        {
            provider.Github.Should().NotBeNull();
            provider.Github!.Name.Should().NotBeNull();
            provider.Name.Should().NotBeNullOrEmpty();
            provider.Id.Should().NotBe(Guid.Empty);
        }
    }

    [Test]
    public async Task ShouldBeAbleToFetchOwnedTeamProjects()
    {
        var userId = await RunAsDefaultUserAsync();
        var team = await CreateTeam(userId);

        var githubProviderId = Guid.NewGuid();
        var provider = FakerInstances
            .SourceProviderFaker(githubProviderId)
            .RuleFor(x => x.TeamId, f => team.Id)
            .Generate();

        var createdProvider = FakerInstances
            .GithubProviderFaker.RuleFor(x => x.SourceProvider, f => provider)
            .RuleFor(x => x.SourceProviderId, f => provider.Id)
            .Generate();

        await AddAsync(createdProvider);

        var result = await SendAsync(Query);

        result.Count().Should().Be(1);
    }

    [Test]
    public async Task ShouldBeAbleToFetchTeamProjectsThatUserIsPartOf()
    {
        var userId = await RunAsDefaultUserAsync();
        var team = await CreateTeam();

        await AddToTeam(team, userId);

        var githubProviderId = Guid.NewGuid();
        var provider = FakerInstances
            .SourceProviderFaker(githubProviderId)
            .RuleFor(x => x.TeamId, f => team.Id)
            .Generate();

        var createdProvider = FakerInstances
            .GithubProviderFaker.RuleFor(x => x.SourceProvider, f => provider)
            .RuleFor(x => x.SourceProviderId, f => provider.Id)
            .Generate();

        await AddAsync(createdProvider);

        var result = await SendAsync(Query);

        result.Count().Should().Be(1);
    }
}
