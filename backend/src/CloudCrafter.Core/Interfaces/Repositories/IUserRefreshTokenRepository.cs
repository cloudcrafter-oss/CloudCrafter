namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IUserRefreshTokenRepository
{
    Task AddRefreshTokenToUserAsync(Guid userId, string refreshToken, DateTime expires);
}
