using CloudCrafter.Domain.Domain.Providers;

namespace CloudCrafter.Core.Interfaces.Domain.Providers;

public interface IProvidersService
{
    Task<bool> CreateGithubProvider(string code, Guid? teamId);
    Task<List<SourceProviderDto>> GetProviders(ProviderFilterRequest filter);
    Task<List<GitProviderRepositoryDto>> GetGitRepositories(Guid providerId);
    Task InstallGithubProvider(Guid providerId, long installationId);
    Task DeleteProvider(Guid providerId);
    Task<List<GitProviderBranchDto>> GetBranches(Guid providerId, string repositoryId);
}
