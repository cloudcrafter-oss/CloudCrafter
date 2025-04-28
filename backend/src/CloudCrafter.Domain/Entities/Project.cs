using CloudCrafter.Domain.Entities.Interfaces;
using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class Project : IHasTimestamps, IHaveATeam
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string? Description { get; set; }
    public required Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;
    public IList<Environment> Environments { get; set; } = new List<Environment>();
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }
}
