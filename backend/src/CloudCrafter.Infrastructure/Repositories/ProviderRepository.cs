using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers.Filter;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Octokit;
using NotFoundException = Ardalis.GuardClauses.NotFoundException;

namespace CloudCrafter.Infrastructure.Repositories;

public class ProviderRepository(IApplicationDbContext context) : IProviderRepository
{
    public async Task<SourceProvider> CreateGithubProvider(GitHubAppFromManifest data, Guid? teamId)
    {
        var providerId = Guid.NewGuid();
        var sourceProvider = new SourceProvider
        {
            Name = data.Name,
            TeamId = teamId,
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

    public async Task<SourceProvider> GetSourceProvider(
        Guid providerId,
        InternalProviderFilter filter
    )
    {
        filter.Id = providerId;

        var providers = GetProvidersForQueries(new ProviderFilterRequest(), filter);

        var provider = await providers.Include(x => x.GithubProvider).FirstOrDefaultAsync();

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

    public Task<List<SourceProvider>> GetProviders(
        ProviderFilterRequest filter,
        InternalProviderFilter internalProviderFilter
    )
    {
        return GetProvidersForQueries(filter, internalProviderFilter).ToListAsync();
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

    private IQueryable<SourceProvider> GetProvidersForQueries(
        ProviderFilterRequest filter,
        InternalProviderFilter internalProviderFilter
    )
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

        if (internalProviderFilter.UserId.HasValue)
        {
            query = query
                .Where(x => x.TeamId.HasValue)
                .Where(x => x.Team != null)
                .Where(x =>
                    x.Team!.OwnerId == internalProviderFilter.UserId.Value
                    || x.Team.TeamUsers.Any(tu => tu.UserId == internalProviderFilter.UserId.Value)
                );
        }

        if (internalProviderFilter.Id.HasValue)
        {
            query = query.Where(x => x.Id == internalProviderFilter.Id.Value);
        }

        return query.OrderBy(x => x.CreatedAt);
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
