using CloudCrafter.Domain.Domain.Providers;

namespace CloudCrafter.Core.Interfaces.Domain.Providers;

public interface IProvidersService
{
    Task<bool> CreateGithubProvider(string code);
    Task<ProviderOverviewDto> GetProviders(ProviderFilterRequest filter);
    Task<List<GitProviderRepositoryDto>> GetGithubRepositories(Guid providerId);
    Task InstallGithubProvider(Guid providerId, long installationId);
}
