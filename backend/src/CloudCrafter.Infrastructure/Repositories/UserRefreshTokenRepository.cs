using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class UserRefreshTokenRepository(IApplicationDbContext dbContext) : IUserRefreshTokenRepository
{
    public async Task AddRefreshTokenToUserAsync(Guid userId, string refreshToken, DateTime expires)
    {
        dbContext.UserRefreshTokens.Add(new UserRefreshToken
        {
            Id = Guid.NewGuid(), Token = refreshToken, ExpiresAt = expires, UserId = userId
        });
        await dbContext.SaveChangesAsync(default);
    }

    public Task<UserRefreshToken?> GetRefreshTokenAsync(string refreshToken)
    {
        return dbContext.UserRefreshTokens
            .Where(x => x.Token == refreshToken)
            .Where(x => x.ExpiresAt > DateTime.UtcNow)
            .FirstOrDefaultAsync();
    }

    public async Task DisableRefreshToken(string refreshTokenToDisable)
    {
        var refreshToken = await GetRefreshTokenAsync(refreshTokenToDisable);

        if (refreshToken == null)
        {
            // Already disabled, go to next
            return;
        }
        
        refreshToken.ExpiresAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(default);
    }
}
