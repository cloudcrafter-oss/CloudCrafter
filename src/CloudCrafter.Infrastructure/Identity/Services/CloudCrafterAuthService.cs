using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CloudCrafter.Core.Domain.Auth;
using CloudCrafter.UseCases.Domain.Auth.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace CloudCrafter.Infrastructure.Identity.Services;

public class CloudCrafterAuthService(UserManager<User> userManager) : ICloudCrafterAuthService
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
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = GetToken(authClaims);

        var actualToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new TokenDto(actualToken, token.ValidTo);
    }

    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            "todoDusdfasdfadfjhkasdjhfshljkfsajkhlasdfhjklfadskhjlsadfklhasdfhklsadflklkhjsadflksadfsfdfasdfsdafdsaadfsafsdfdsaasdffsadfasdmmy"));

        var token = new JwtSecurityToken(
            issuer: "todoIssuer",
            audience: "todoAudience",
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }
}
