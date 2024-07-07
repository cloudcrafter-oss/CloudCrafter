using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Core.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<UserRefreshToken> UserRefreshTokens { get; }
    DbSet<Server> Servers { get; }
    DbSet<Project> Projects { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
