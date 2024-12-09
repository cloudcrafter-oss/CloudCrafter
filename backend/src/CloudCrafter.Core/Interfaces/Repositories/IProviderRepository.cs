using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using Octokit;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IProviderRepository
{
    Task<GithubProvider> CreateGithubProvider(GitHubAppFromManifest data);
    Task<GithubProvider> GetGithubProvider(Guid providerId);
    Task SaveChangesAsync();
    Task<List<BaseSourceProvider>> GetProviders(ProviderFilterRequest filter);
    Task DeleteProvider(Guid providerId);
}
