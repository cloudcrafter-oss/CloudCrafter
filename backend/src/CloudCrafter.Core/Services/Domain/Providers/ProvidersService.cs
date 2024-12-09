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
    IGithubClientProvider clientProvider,
    IProviderRepository repository,
    ILogger<ProvidersService> logger,
    GithubBackendClientProvider githubBackendClientProvider,
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
        List<BaseSourceProvider> providers = await repository.GetProviders(filter);

        return mapper.Map<List<SourceProviderDto>>(providers);
    }

    public async Task<List<GitProviderRepositoryDto>> GetGithubRepositories(Guid providerId)
    {
        var provider = await repository.GetGithubProvider(providerId);
        try
        {
            var client = githubBackendClientProvider.CreateClientForProvider(provider);

            var app = await client.GitHubApps.GetCurrent();
            var installations = await client.GitHubApps.GetAllInstallationsForCurrent();

            var repositoriesList = new List<GitProviderRepositoryDto>();

            foreach (var installation in installations)
            {
                var token = await client.GitHubApps.CreateInstallationToken(installation.Id);

                var installationClient = clientProvider.GetClientForToken(token.Token);

                var result =
                    await installationClient.GitHubApps.Installation.GetAllRepositoriesForCurrent();

                repositoriesList.AddRange(
                    result.Repositories.Select(x => new GitProviderRepositoryDto
                    {
                        FullName = x.FullName,
                        Id = x.Id,
                    })
                );
            }

            return repositoriesList;
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Failed to get Github repositories");
            throw;
        }
    }

    public async Task InstallGithubProvider(Guid providerId, long installationId)
    {
        var provider = await repository.GetGithubProvider(providerId);

        if (provider.InstallationId.HasValue)
        {
            return;
        }

        provider.InstallationId = installationId;
        await repository.SaveChangesAsync();
    }

    public Task DeleteProvider(Guid providerId)
    {
        return repository.DeleteProvider(providerId);
    }
}
