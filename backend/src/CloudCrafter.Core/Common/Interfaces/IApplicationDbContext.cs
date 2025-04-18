using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Entities.Jobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Environment = CloudCrafter.Domain.Entities.Environment;

namespace CloudCrafter.Core.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<UserRefreshToken> UserRefreshTokens { get; }
    DbSet<Server> Servers { get; }
    DbSet<Project> Projects { get; }
    DbSet<Environment> Environments { get; }
    DbSet<Stack> Stacks { get; }
    DbSet<Deployment> Deployments { get; }
    DbSet<BackgroundJob> Jobs { get; }
    DbSet<Team> Teams { get; }
    DbSet<StackService> StackServices { get; }
    DbSet<StackServiceType> StackServiceTypes { get; }
    DbSet<StackServiceVolume> StackServiceVolumes { get; }
    DbSet<ServerConnectivityCheckJob> ServerConnectivityCheckJobs { get; }
    DbSet<SourceProvider> SourceProviders { get; }
    DbSet<GithubProvider> GithubProviders { get; }
    DbSet<StackEnvironmentVariable> StackEnvironmentVariables { get; }
    DbSet<StackEnvironmentVariableGroup> StackEnvironmentVariableGroups { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    int SaveChanges();

    Task<IDbContextTransaction> BeginTransactionAsync(
        CancellationToken cancellationToken = default
    );
}
