using System.Security.Claims;
using CloudCrafter.Core.Domain.Auth;
using CloudCrafter.UseCases.Domain.Auth.Services;
using Microsoft.AspNetCore.Identity;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace CloudCrafter.Infrastructure.Identity.Services;

public class CloudCrafterAuthService(UserManager<User> userManager, IJwtService jwtService) : ICloudCrafterAuthService
{
    public async Task<TokenDto> LoginAsync(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user == null || !await userManager.CheckPasswordAsync(user, password))
        {
            throw new UnauthorizedAccessException();
        }


        var roles = await userManager.GetRolesAsync(user);
        var authClaims = new List<Claim>
        {
            new(ClaimTypes.Name, user.UserName!), new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDto = jwtService.GenerateForClaims(authClaims);

        return tokenDto;
    }
}
