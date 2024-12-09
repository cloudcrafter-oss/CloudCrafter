using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using Octokit;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IProviderRepository
{
    Task<SourceProvider> CreateGithubProvider(GitHubAppFromManifest data);
    Task<List<SourceProvider>> GetGithubProviders(ProviderFilterRequest filter);
    Task<SourceProvider> GetGithubProvider(Guid providerId);
    Task SaveChangesAsync();
}
