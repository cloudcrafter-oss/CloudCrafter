namespace CloudCrafter.Domain.Entities;

public class GithubProvider : GitProvider
{
    public required string? AppName { get; set; }
    public required long? AppId { get; set; }
    public required string? AppClientId { get; set; }
    public required string? AppClientSecret { get; set; }
    public required string? AppWebhookSecret { get; set; }
    public required string? AppPrivateKey { get; set; }
    public required bool? IsValid { get; set; }
}
