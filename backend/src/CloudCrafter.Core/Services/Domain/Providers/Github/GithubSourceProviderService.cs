using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;
using Octokit;

namespace CloudCrafter.Core.Services.Domain.Providers.Github;

public class GithubSourceProviderService(
    ILogger<GithubSourceProviderService> logger,
    GithubBackendClientProvider githubBackendClientProvider,
    IGithubClientProvider clientProvider
) : ISourceProviderService
{
    public async Task<List<GitProviderRepositoryDto>> GetRepositories(SourceProvider provider)
    {
        var client = await CreateInstallationClient(provider);

        var repositoriesList = new List<GitProviderRepositoryDto>();

        var result = await client.GitHubApps.Installation.GetAllRepositoriesForCurrent();

        repositoriesList.AddRange(
            result.Repositories.Select(x => new GitProviderRepositoryDto
            {
                FullName = x.FullName,
                Id = x.Id,
            })
        );

        return repositoriesList;
    }

    public async Task<List<GitProviderBranchDto>> GetBranches(
        SourceProvider provider,
        string repositoryId
    )
    {
        var client = await CreateInstallationClient(provider);

        var branchResult = new List<GitProviderBranchDto>();

        try
        {
            var branches = await client.Repository.Branch.GetAll(long.Parse(repositoryId));

            branchResult.AddRange(branches.Select(x => new GitProviderBranchDto { Name = x.Name }));
        }
        catch (NotFoundException ex)
        {
            logger.LogCritical(ex, "Repository not found");
            throw new Ardalis.GuardClauses.NotFoundException("repository", "Repository not found");
        }

        return branchResult;
    }

    public async Task<string> GetCheckoutAccessTokenAsync(SourceProvider provider)
    {
        if (!provider.GithubProvider!.InstallationId.HasValue)
        {
            throw new Exception("Provider is not a Github provider or not installed properly.");
        }

        var client = githubBackendClientProvider.CreateClientForProvider(provider.GithubProvider!);

        var token = await client.GitHubApps.CreateInstallationToken(
            provider.GithubProvider!.InstallationId.Value
        );

        var installationClient = clientProvider.GetClientForToken(token.Token);
        var result =
            await installationClient.GitHubApps.Installation.GetAllRepositoriesForCurrent();

        if (result == null)
        {
            throw new Exception("Failed to get installation repositories");
        }

        return token.Token;
    }

    public async Task<GitSourceLocationDto> GetSourceLocation(
        SourceProvider provider,
        ApplicationSource source
    )
    {
        if (source.GithubApp == null)
        {
            throw new Exception("Provided service is not a Github service");
        }

        var client = await CreateInstallationClient(provider);

        var repository = await client.Repository.Get(long.Parse(source.GithubApp.RepositoryId));

        return new GitSourceLocationDto
        {
            FullPath = repository.FullName,
            GitUrl = repository.GitUrl,
        };
    }

    private async Task<IGitHubClient> CreateInstallationClient(SourceProvider provider)
    {
        if (!provider.GithubProvider!.InstallationId.HasValue)
        {
            throw new Exception("Provider is not a Github provider or not installed properly.");
        }

        var client = githubBackendClientProvider.CreateClientForProvider(provider.GithubProvider!);

        var token = await client.GitHubApps.CreateInstallationToken(
            provider.GithubProvider!.InstallationId.Value
        );

        var installationClient = clientProvider.GetClientForToken(token.Token);
        return installationClient;
    }
}
