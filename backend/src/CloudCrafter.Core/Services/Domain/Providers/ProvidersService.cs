using AutoMapper;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.Core.Services.Domain.Providers.Github;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Providers;

public class ProvidersService(
    ISourceProviderProxy providerProxy,
    IGithubClientProvider clientProvider,
    IProviderRepository repository,
    ILogger<ProvidersService> logger,
    IMapper mapper
) : IProvidersService
{
    public async Task<bool> CreateGithubProvider(string code)
    {
        try
        {
            var client = clientProvider.GetClient();

            var data = await client.GitHubApps.CreateAppFromManifest(code);

            if (data == null)
            {
                return false;
            }

            var result = await repository.CreateGithubProvider(data);

            return true;
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Failed to create Github provider");
        }

        return false;
    }

    public async Task<List<SourceProviderDto>> GetProviders(ProviderFilterRequest filter)
    {
        List<SourceProvider> providers = await repository.GetProviders(filter);

        return mapper.Map<List<SourceProviderDto>>(providers);
    }

    public async Task<List<GitProviderRepositoryDto>> GetGitRepositories(Guid providerId)
    {
        var provider = await repository.GetSourceProvider(providerId);
        try
        {
            return await providerProxy.GetRepositories(provider);
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Failed to get repositories at Source Provider");
            throw;
        }
    }

    public async Task<List<GitProviderBranchDto>> GetBranches(Guid providerId, string repositoryId)
    {
        var provider = await repository.GetSourceProvider(providerId);
        try
        {
            return await providerProxy.GetBranches(provider, repositoryId);
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Failed to get branches at Source Provider");
            throw;
        }
    }

    public async Task InstallGithubProvider(Guid providerId, long installationId)
    {
        var provider = await repository.GetSourceProvider(providerId);

        if (provider.GithubProvider == null || provider.GithubProvider.InstallationId.HasValue)
        {
            return;
        }

        provider.GithubProvider.InstallationId = installationId;
        await repository.SaveChangesAsync();
    }

    public Task DeleteProvider(Guid providerId)
    {
        return repository.DeleteProvider(providerId);
    }
}
