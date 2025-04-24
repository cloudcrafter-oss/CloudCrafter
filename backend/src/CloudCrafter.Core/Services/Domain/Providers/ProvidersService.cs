using AutoMapper;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers.Filter;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Providers;

public class ProvidersService(
    ISourceProviderProxy providerProxy,
    IGithubClientProvider clientProvider,
    IProviderRepository repository,
    ILogger<ProvidersService> logger,
    IMapper mapper,
    IUserAccessService accessService,
    IUser user
) : IProvidersService
{
    public async Task<bool> CreateGithubProvider(string code, Guid? teamId)
    {
        try
        {
            var client = clientProvider.GetClient();

            var data = await client.GitHubApps.CreateAppFromManifest(code);

            if (data == null)
            {
                return false;
            }

            var result = await repository.CreateGithubProvider(data, teamId);

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
        var isAdmin = await accessService.IsAdministrator(user.Id);

        var internalFilter = new InternalProviderFilter();

        if (!isAdmin)
        {
            internalFilter.UserId = user.Id;
        }

        var providers = await repository.GetProviders(filter, internalFilter);

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

        await accessService.EnsureCanMutateEntity(provider, user.Id);

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
