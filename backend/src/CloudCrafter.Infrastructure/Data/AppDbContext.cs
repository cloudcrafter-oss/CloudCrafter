using System.Reflection;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.ContributorAggregate;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Core.Configuration;
using EntityFrameworkCore.EncryptColumn.Extensions;
using EntityFrameworkCore.EncryptColumn.Util;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CloudCrafter.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<User, Role, Guid>, IApplicationDbContext
{
    private readonly IDomainEventDispatcher? _dispatcher;
    private readonly GenerateEncryptionProvider _encryptionProvider;

    public AppDbContext(DbContextOptions<AppDbContext> options,
        IDomainEventDispatcher? dispatcher, IOptions<CloudCrafterConfig> cloudCrafterConfig)
        : base(options)
    {
        _dispatcher = dispatcher;
        _encryptionProvider = new GenerateEncryptionProvider(cloudCrafterConfig.Value.AppKey);
    }

    public DbSet<Contributor> Contributors => Set<Contributor>();
    public DbSet<UserRefreshToken> UserRefreshTokens => Set<UserRefreshToken>();
    public DbSet<Server> Servers => Set<Server>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Deployment> Deployments => Set<Deployment>();
    public DbSet<BackgroundJob> Jobs => Set<BackgroundJob>();

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
    {
        var result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        // ignore events if no dispatcher provided
        if (_dispatcher == null)
        {
            return result;
        }

        // dispatch events only if save was successful
        var entitiesWithEvents = ChangeTracker.Entries<EntityBase>()
            .Select(e => e.Entity)
            .Where(e => e.DomainEvents.Any())
            .ToArray();

        await _dispatcher.DispatchAndClearEvents(entitiesWithEvents);

        return result;
    }

    public override int SaveChanges()
    {
        return SaveChangesAsync().GetAwaiter().GetResult();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        modelBuilder.UseEncryption(_encryptionProvider);
    }
}
