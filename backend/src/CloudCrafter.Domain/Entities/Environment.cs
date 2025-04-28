using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class Environment : IHasTimestamps
{
    public required Guid Id { get; init; }
    public Project Project { get; set; } = null!;
    public Guid ProjectId { get; set; }
    public required string Name { get; set; }
    public List<Stack> Stacks { get; set; } = new();
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }
}
