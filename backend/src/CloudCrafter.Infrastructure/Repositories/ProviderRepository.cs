using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Entities;
using Octokit;

namespace CloudCrafter.Infrastructure.Repositories;

public class ProviderRepository(IApplicationDbContext context) : IProviderRepository
{
    public async Task<GithubProvider> CreateGithubProvider(GitHubAppFromManifest data)
    {
        var provider = new GithubProvider
        {
            AppName = data.Name,
            Id = Guid.NewGuid(),
            Name = data.Name,
            AppId = data.Id,
            AppClientId = data.ClientId,
            AppClientSecret = data.ClientSecret,
            AppWebhookSecret = data.WebhookSecret,
            AppPrivateKey = data.Pem,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        context.GithubProviders.Add(provider);
        await context.SaveChangesAsync();

        return provider;
    }
}
