using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers.Filter;
using CloudCrafter.Domain.Entities;
using Octokit;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IProviderRepository
{
    Task<SourceProvider> CreateGithubProvider(GitHubAppFromManifest data, Guid? teamId);
    Task<SourceProvider> GetSourceProvider(Guid providerId, InternalProviderFilter filter);
    Task SaveChangesAsync();

    Task<List<SourceProvider>> GetProviders(
        ProviderFilterRequest filter,
        InternalProviderFilter internalFilter
    );

    Task DeleteProvider(Guid providerId);
}
