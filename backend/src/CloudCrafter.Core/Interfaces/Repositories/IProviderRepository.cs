using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using Octokit;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IProviderRepository
{
    Task<GithubProvider> CreateGithubProvider(GitHubAppFromManifest data);
    Task<List<GithubProvider>> GetGithubProviders(ProviderFilterRequest filter);
    Task<GithubProvider> GetGithubProvider(Guid providerId);
    Task SaveChangesAsync();
}
