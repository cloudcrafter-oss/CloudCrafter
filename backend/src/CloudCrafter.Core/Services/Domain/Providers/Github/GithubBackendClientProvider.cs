using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.Domain.Entities;
using GitHubJwt;
using Octokit;

namespace CloudCrafter.Core.Services.Domain.Providers.Github;

public class GithubBackendClientProvider(IGithubClientProvider provider)
{
    public IGitHubClient CreateClientForProvider(GithubProvider entity)
    {
        var generator = new GitHubJwtFactory(
            new CloudCrafterStringPrivateKeySource(entity.AppPrivateKey!),
            new GitHubJwtFactoryOptions
            {
                AppIntegrationId = (int)entity.AppId.GetValueOrDefault(), // The GitHub App Id
                ExpirationSeconds =
                    10 // 10 minutes is the maximum time allowed
                ,
            }
        );

        var token = generator.CreateEncodedJwtToken();

        return provider.GetClientForToken(token);
    }
}
