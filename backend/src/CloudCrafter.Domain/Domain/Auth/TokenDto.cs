namespace CloudCrafter.Domain.Domain.Auth;

public record TokenDto(string AccessToken, string RefreshToken, DateTime RefreshTokenExpires)
{
    public int RefreshTokenExpiresIn =>
        (int)RefreshTokenExpires.Subtract(DateTime.UtcNow).TotalSeconds;
}
