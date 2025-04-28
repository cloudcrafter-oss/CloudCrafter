using CloudCrafter.Domain.Domain.Auth;
using CloudCrafter.Domain.Domain.User;

namespace CloudCrafter.Core.Interfaces.Domain.Auth;

public interface ICloudCrafterAuthService
{
    Task<TokenDto> LoginAsync(string email, string password);
    Task<TokenDto> CreateUserAsync(string email, string name);
    Task<Guid> CreateUserWithPasswordAsync(string email, string name, string password);
    Task<TokenDto> FetchTokensForRefreshToken(string requestRefreshToken);
    Task<List<RoleDto>> GetRoles(Guid userId);
}
