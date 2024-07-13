using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities.Jobs;

public class ServerConnectivityCheckJob : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required Server Server { get; init; }
    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }
}
