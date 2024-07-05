namespace CloudCrafter.Domain.Domain.Auth;

public record TokenDto(string AccessToken, string RefreshToken, DateTime ValidTo)
{
    public int ExpiresIn => (int)ValidTo.Subtract(DateTime.UtcNow).TotalSeconds;
}
