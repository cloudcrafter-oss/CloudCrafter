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
        var providerId = Guid.NewGuid();
        var sourceProvider = new SourceProvider
        {
            Name = data.Name,
            TeamId = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            GithubProviderId = providerId,
            Id = Guid.NewGuid(),
        };
        var provider = new GithubProvider
        {
            AppName = data.Name,
            Id = providerId,
            AppId = data.Id,
            IsValid = null,
            AppUrl = data.HtmlUrl,
            AppClientId = data.ClientId,
            AppClientSecret = data.ClientSecret,
            AppWebhookSecret = data.WebhookSecret,
            AppPrivateKey = data.Pem,
            SourceProvider = sourceProvider,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        context.GithubProviders.Add(provider);
        await context.SaveChangesAsync();

        return sourceProvider;
    }

    public async Task<SourceProvider> GetSourceProvider(Guid providerId)
    {
        var provider = await context
            .SourceProviders.Where(x => x.Id == providerId)
            .Include(x => x.GithubProvider)
            .FirstOrDefaultAsync();

        if (provider == null)
        {
            throw new NotFoundException("provider", "Source provider not found");
        }

        return provider;
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }

    public Task<List<SourceProvider>> GetProviders(ProviderFilterRequest filter)
    {
        IQueryable<SourceProvider> query = context.SourceProviders.Include(x => x.GithubProvider);

        if (filter.IsActive.HasValue)
        {
            query = query.Where(x =>
                x.GithubProviderId.HasValue
                && x.GithubProvider != null
                && x.GithubProvider.IsValid.HasValue
                && x.GithubProvider.IsValid.Value == filter.IsActive.Value
            );
        }

        return query.OrderBy(x => x.CreatedAt).ToListAsync();
    }

    public async Task DeleteProvider(Guid providerId)
    {
        var provider = await context.SourceProviders.FirstOrDefaultAsync(x => x.Id == providerId);

        if (provider == null)
        {
            throw new NotFoundException("provider", "Source provider not found");
        }

        context.SourceProviders.Remove(provider);
        await context.SaveChangesAsync();
    }

    public Task<List<GithubProvider>> GetGithubProviders(ProviderFilterRequest filter)
    {
        var query = context.SourceProviders.OfType<GithubProvider>().AsQueryable();

        if (filter.IsActive.HasValue)
        {
            query = query.Where(x =>
                x.IsValid.HasValue && x.IsValid.Value == filter.IsActive.Value
            );
        }

        return query.OrderByDescending(x => x.CreatedAt).ToListAsync();
    }
}
