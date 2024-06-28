using System.Security.Claims;
using CloudCrafter.UseCases.Domain.Auth.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;

namespace CloudCrafter.Infrastructure.Identity.Services;

public class CloudCrafterAuthService(UserManager<User> userManager) : ICloudCrafterAuthService
{
    public async Task LoginAsync(string username, string password)
    {
        var user = await userManager.FindByEmailAsync(username);

        if (user != null && await userManager.CheckPasswordAsync(user, password))
        {
            var roles = await userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
        }
    }
}
