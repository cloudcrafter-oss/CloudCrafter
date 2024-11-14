using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Services.Core.Providers;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Providers;

public class ProvidersService(
    IGithubClientProvider clientProvider,
    IProviderRepository repository,
    ILogger<ProvidersService> logger
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
}
