using CloudCrafter.Core.Domain.Auth;

namespace CloudCrafter.UseCases.Domain.Auth.Services;

public interface ICloudCrafterAuthService
{
    Task<TokenDto> LoginAsync(string email, string password);
}
