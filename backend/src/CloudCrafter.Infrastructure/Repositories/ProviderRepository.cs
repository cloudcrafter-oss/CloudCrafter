using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Octokit;
using NotFoundException = Ardalis.GuardClauses.NotFoundException;

namespace CloudCrafter.Infrastructure.Repositories;

public class ProviderRepository(IApplicationDbContext context) : IProviderRepository
{
    public async Task<SourceProvider> CreateGithubProvider(GitHubAppFromManifest data)
    {
        var provider = new GithubProvider
        {
            AppName = data.Name,
            Id = Guid.NewGuid(),
            Name = data.Name,
            AppId = data.Id,
            IsValid = null,
            AppUrl = data.HtmlUrl,
            AppClientId = data.ClientId,
            AppClientSecret = data.ClientSecret,
            AppWebhookSecret = data.WebhookSecret,
            AppPrivateKey = data.Pem,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var sourceProvider = new SourceProvider
        {
            Id = Guid.NewGuid(),
            Name = data.Name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Github = provider,
        };

        context.SourceProviders.Add(sourceProvider);
        await context.SaveChangesAsync();

        return sourceProvider;
    }

    public async Task<SourceProvider> GetGithubProvider(Guid providerId)
    {
        var provider = await context
            .SourceProviders.Where(x => x.Id == providerId)
            .Include(x => x.Github)
            .FirstOrDefaultAsync();

        if (provider == null || provider.Github == null)
        {
            throw new NotFoundException("github", "Github provider not found");
        }

        return provider;
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }

    public Task<List<SourceProvider>> GetProviders(ProviderFilterRequest filter)
    {
        IQueryable<SourceProvider> query = context.SourceProviders.Include(x => x.Github);

        if (filter.IsActive.HasValue)
        {
            query = query.Where(x =>
                x.Github != null
                && x.Github.IsValid.HasValue
                && x.Github.IsValid.Value == filter.IsActive.Value
            );
        }

        return query.OrderBy(x => x.CreatedAt).ToListAsync();
    }

    public Task<List<SourceProvider>> GetGithubProviders(ProviderFilterRequest filter)
    {
        var query = context.SourceProviders.AsQueryable();

        query = query.Where(x => x.GithubProviderId.HasValue).Include(x => x.Github);

        if (filter.IsActive.HasValue)
        {
            query = query.Where(x =>
                x.Github != null
                && x.Github.IsValid.HasValue
                && x.Github.IsValid.Value == filter.IsActive.Value
            );
        }

        return query.OrderByDescending(x => x.CreatedAt).ToListAsync();
    }
}
