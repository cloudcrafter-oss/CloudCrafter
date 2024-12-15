using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Core.Services.Domain.Providers.Proxy;

public class SourceProviderProxy([FromKeyedServices("github")] ISourceProviderService githubService)
    : ISourceProviderProxy
{
    public async Task<List<GitProviderRepositoryDto>> GetRepositories(SourceProvider provider)
    {
        if (provider.GithubProvider != null)
        {
            return await githubService.GetRepositories(provider);
        }

        throw new NotImplementedException("Not implemented for given provider");
    }

    public async Task<List<GitProviderBranchDto>> GetBranches(
        SourceProvider provider,
        string repositoryId
    )
    {
        if (provider.GithubProvider != null)
        {
            return await githubService.GetBranches(provider, repositoryId);
        }

        throw new NotImplementedException("Not implemented for given provider");
    }

    public async Task<string> GetCheckoutAccessTokenAsync(SourceProvider provider)
    {
        if (provider.GithubProvider != null)
        {
            return await githubService.GetCheckoutAccessTokenAsync(provider);
        }

        throw new NotImplementedException("Not implemented for given provider");
    }
}
