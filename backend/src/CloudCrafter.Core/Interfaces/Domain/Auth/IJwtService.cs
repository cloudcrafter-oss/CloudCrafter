using CloudCrafter.Domain.Domain.Auth;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Domain.Auth;

public interface IJwtService
{
    Task<TokenDto> GenerateTokenForUserAsync(User user, List<string> roles);
    Task<Guid?> GetUserIdFromRefreshToken(string refreshToken);
    Task DisableRefreshToken(string refreshTokenToDisable);
}
