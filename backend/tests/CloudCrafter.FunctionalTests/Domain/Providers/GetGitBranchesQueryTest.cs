using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Core.Exceptions;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Providers;

using static Testing;

public class GetGitBranchesQueryTest : ProviderBaseTest
{
    private readonly GetGitBranchesQuery Query = new(Guid.NewGuid(), "dummy");

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldThrowNotFoundExceptionWhenProviderIsNotFound()
    {
        await RunAsAdministratorAsync();

        Assert.ThrowsAsync<NotFoundException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldBeAbleToGetBranches()
    {
        await RunAsAdministratorAsync();
        var provider = await CreateGithubSourceProvider();

        var result = await SendAsync(
            Query with
            {
                ProviderId = provider.Id,
                RepositoryId = "903683855",
            }
        );
        result.Should().NotBeNull();
        result.Any(x => x.Name == "main").Should().BeTrue();
    }

    [Test]
    public async Task ShouldNotBeAbleToAccessProviderWhenNotInTeam()
    {
        await RunAsDefaultUserAsync();
        var provider = await CreateGithubSourceProvider();

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(Query with { ProviderId = provider.Id })
        );
    }
}
