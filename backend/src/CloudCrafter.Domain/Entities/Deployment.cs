using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class Deployment : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }

    public required Stack Stack { get; set; } 
    public required List<DeploymentLog> Logs { get; init; }
}
