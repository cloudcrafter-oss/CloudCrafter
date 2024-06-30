using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using CloudCrafter.Infrastructure.Core.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CloudCrafter.Infrastructure.Identity.Services;

public class JwtService(IOptions<JwtSettings> jwtSettings) : IJwtService
{
    public TokenDto GenerateForClaims(List<Claim> authClaims)
    {
        var token = GetToken(authClaims);

        var actualToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new TokenDto(actualToken, token.ValidTo);
    }

    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            jwtSettings.Value.SecretKey));

        var token = new JwtSecurityToken(
            jwtSettings.Value.Issuer,
            jwtSettings.Value.Audience,
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }
}
