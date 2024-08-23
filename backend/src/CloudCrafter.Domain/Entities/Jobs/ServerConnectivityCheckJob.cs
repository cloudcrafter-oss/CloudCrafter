using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities.Jobs;

public class ServerConnectivityCheckJob : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required Guid ServerId { get; init; }
    public Server Server { get; init; } = null!;
    public required ServerConnectivityCheckResult Result { get; set; } = ServerConnectivityCheckResult.Unknown;
    public long? TimeTakenMs { get; set; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }
}

public enum ServerConnectivityCheckResult
{
    Unknown,
    Healthy,
    Degraded,
    Unhealthy
}
