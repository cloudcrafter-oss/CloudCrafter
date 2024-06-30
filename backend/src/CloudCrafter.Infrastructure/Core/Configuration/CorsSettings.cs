namespace CloudCrafter.Infrastructure.Core.Configuration;

public class CorsSettings
{
    public const string KEY = "CorsSettings";

    public List<string> AllowedOrigins { get; init; } = new();
}
