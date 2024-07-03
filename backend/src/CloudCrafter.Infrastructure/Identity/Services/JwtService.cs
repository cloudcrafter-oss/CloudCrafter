using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Auth;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Core.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CloudCrafter.Infrastructure.Identity.Services;

public class JwtService(IOptions<JwtSettings> jwtSettings, IUserRefreshTokenRepository userRefreshTokenRepository) : IJwtService
{
    public (string,DateTime) GenerateForClaims(List<Claim> authClaims)
    {
        var token = GetToken(authClaims);

        var actualToken = new JwtSecurityTokenHandler().WriteToken(token);

        return (actualToken, token.ValidTo);
    }

    public async Task<TokenDto> GenerateTokenForUserAsync(User user, List<string> roles)
    {
        var authClaims = new List<Claim>
        {
            new(ClaimTypes.Name, user.UserName!), 
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        };

        var tokenDto = GenerateForClaims(authClaims);
        
        // Store refresh token
        var refreshToken = GenerateRefreshToken();
        await userRefreshTokenRepository.AddRefreshTokenToUserAsync(user.Id, refreshToken,
            DateTime.UtcNow.AddSeconds(jwtSettings.Value.RefreshTokenValidInSeconds));


        return new TokenDto(tokenDto.Item1, refreshToken, tokenDto.Item2);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            jwtSettings.Value.SecretKey));

        var token = new JwtSecurityToken(
            jwtSettings.Value.Issuer,
            jwtSettings.Value.Audience,
            expires: DateTime.UtcNow.AddSeconds(jwtSettings.Value.AccessTokenValidInSeconds),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }
}
