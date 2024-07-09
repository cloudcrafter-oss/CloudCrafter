namespace CloudCrafter.DeploymentEngine.Domain.Models;

public record EngineServerModel
{
    public required string Host { get; init; }
    public required string Username { get; init; }
    public required int Port { get; init; }
    public required string SshKey { get; init; }
}
