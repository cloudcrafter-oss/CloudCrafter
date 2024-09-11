using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities.Jobs;

public class ServerConnectivityCheckJob : BaseAuditableEntity
{
    public required Guid ServerId { get; init; }
    public Server Server { get; init; } = null!;
    public required ServerConnectivityCheckResult Result { get; set; } =
        ServerConnectivityCheckResult.Unknown;
    public long? TimeTakenMs { get; set; }
}

public enum ServerConnectivityCheckResult
{
    Unknown,
    Healthy,
    Degraded,
    Unhealthy,
}
