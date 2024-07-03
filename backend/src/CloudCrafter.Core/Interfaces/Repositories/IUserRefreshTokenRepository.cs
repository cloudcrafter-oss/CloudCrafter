using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IUserRefreshTokenRepository
{
    Task AddRefreshTokenToUserAsync(Guid userId, string refreshToken, DateTime expires);
    Task<UserRefreshToken?> GetRefreshTokenAsync(string refreshToken);
}
