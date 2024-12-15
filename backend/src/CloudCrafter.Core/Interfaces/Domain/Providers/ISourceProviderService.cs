using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Domain.Providers;

public interface ISourceProviderService
{
    Task<List<GitProviderRepositoryDto>> GetRepositories(SourceProvider provider);
    Task<List<GitProviderBranchDto>> GetBranches(SourceProvider provider, string repositoryId);
    Task<string> GetCheckoutAccessTokenAsync(SourceProvider provider);
}
