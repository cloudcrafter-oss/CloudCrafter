using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.Core.Services.Domain.Providers.Github;
using CloudCrafter.Domain.Entities;
using GitHubJwt;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Core.Services.Domain.Providers;

public class ProviderValidationService(
    IApplicationDbContext context,
    IGithubClientProvider clientProvider
) : IProviderValidationService
{
    public async Task ValidateAll()
    {
        var githubProviders = await context
            .GithubProviders.OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        foreach (var githubProvider in githubProviders)
        {
            await ValidateGithubProvider(githubProvider);
        }

        await context.SaveChangesAsync();
    }

    private async Task ValidateGithubProvider(GithubProvider provider)
    {
        var isValid = !string.IsNullOrWhiteSpace(provider.AppPrivateKey);

        if (!isValid || !provider.AppId.HasValue)
        {
            provider.IsValid = false;
            return;
        }

        try
        {
            var generator = new GitHubJwtFactory(
                new CloudCrafterStringPrivateKeySource(provider.AppPrivateKey!),
                new GitHubJwtFactoryOptions
                {
                    AppIntegrationId = (int)provider.AppId.Value, // The GitHub App Id
                    ExpirationSeconds =
                        10 // 10 minutes is the maximum time allowed
                    ,
                }
            );

            var token = generator.CreateEncodedJwtToken();

            var client = clientProvider.GetClientForToken(token);

            var result = await client.GitHubApps.GetCurrent();

            provider.IsValid = result != null;
        }
        catch (Exception)
        {
            provider.IsValid = false;
        }
    }
}
