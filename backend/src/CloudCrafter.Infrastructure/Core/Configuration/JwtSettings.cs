using System.ComponentModel.DataAnnotations;
using CloudCrafter.Infrastructure.Core.Configuration.Attributes;

namespace CloudCrafter.Infrastructure.Core.Configuration;

public class JwtSettings
{
    public const string KEY = "JwtSettings";
    
    [Required]
    [ValidJwtSecretKey]
    public string SecretKey { get; init; } = null!;
    
    [Required]
    public string Issuer { get; init; } = null!;
    
    [Required]
    public string Audience { get; init; } = null!;

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Please set RefreshTokenValidInSeconds")]
    public int RefreshTokenValidInSeconds { get; init; }
    
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Please set AccessTokenValidInSeconds")]
    public int AccessTokenValidInSeconds { get; init; }
}
