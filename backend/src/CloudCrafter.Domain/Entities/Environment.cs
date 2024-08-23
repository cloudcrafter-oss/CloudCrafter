using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class Environment : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required Project Project { get; set; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }
    public required string Name { get; set; }
}
