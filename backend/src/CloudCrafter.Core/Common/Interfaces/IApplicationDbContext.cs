using CloudCrafter.Domain.Entities;
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
    DbSet<ApplicationService> ApplicationServices { get; }
    DbSet<ApplicationServiceType> ApplicationServiceTypes { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    int SaveChanges();
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}
