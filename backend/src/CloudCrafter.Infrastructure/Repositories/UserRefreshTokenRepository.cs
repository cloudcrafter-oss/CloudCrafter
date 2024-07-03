using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Infrastructure.Repositories;

public class UserRefreshTokenRepository(IApplicationDbContext dbContext) : IUserRefreshTokenRepository
{
    public async Task AddRefreshTokenToUserAsync(Guid userId, string refreshToken, DateTime expires)
    {
        dbContext.UserRefreshTokens.Add(new UserRefreshToken()
        {
            Id = Guid.NewGuid(), Token = refreshToken, ExpiresAt = expires, UserId = userId
        });
        await dbContext.SaveChangesAsync(default);
    }
}
