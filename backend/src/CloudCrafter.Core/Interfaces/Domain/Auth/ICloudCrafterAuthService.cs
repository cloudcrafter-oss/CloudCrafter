
using CloudCrafter.Domain.Domain.Auth;

namespace CloudCrafter.Core.Interfaces.Domain.Auth;

public interface ICloudCrafterAuthService
{
    Task<TokenDto> LoginAsync(string email, string password);
}
