using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class Project : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string? Description { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }
}
