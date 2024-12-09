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
    public async Task<GithubProvider> CreateGithubProvider(GitHubAppFromManifest data)
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

        context.SourceProviders.Add(provider);
        await context.SaveChangesAsync();

        return provider;
    }

    public async Task<GithubProvider> GetGithubProvider(Guid providerId)
    {
        var provider = await context
            .SourceProviders.OfType<GithubProvider>()
            .Where(x => x.Id == providerId)
            .FirstOrDefaultAsync();

        if (provider == null)
        {
            throw new NotFoundException("github", "Github provider not found");
        }

        return provider;
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }

    public Task<List<BaseSourceProvider>> GetProviders(ProviderFilterRequest filter)
    {
        IQueryable<BaseSourceProvider> query = context.SourceProviders;

        if (filter.IsActive.HasValue)
        {
            query = query
                .OfType<GithubProvider>()
                .Where(gp => gp.IsValid.HasValue && gp.IsValid.Value == filter.IsActive.Value);
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
