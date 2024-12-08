using AutoMapper;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.Core.Services.Domain.Providers.Github;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers.Github;
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

    public async Task<ProviderOverviewDto> GetProviders(ProviderFilterRequest filter)
    {
        var github = await repository.GetGithubProviders(filter);

        return new ProviderOverviewDto
        {
            Github = mapper.Map<List<SimpleGithubProviderDto>>(github),
        };
    }

    public async Task<List<GitProviderRepositoryDto>> GetGithubRepositories(Guid providerId)
    {
        var provider = await repository.GetGithubProvider(providerId);
        try
        {
            var client = githubBackendClientProvider.CreateClientForProvider(provider);

            var app = await client.GitHubApps.GetCurrent();
            var installations = await client.GitHubApps.GetAllInstallationsForCurrent();

            foreach (var installation in installations)
            {
                // // Get repositories for each installation
                // Console.WriteLine($"Repositories for Installation {installation.Id}:");
                // foreach (var repo in installationRepositories.Repositories)
                // {
                //     Console.WriteLine($"- {repo.FullName}");
                // }
            }

            return new List<GitProviderRepositoryDto>();
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
}
