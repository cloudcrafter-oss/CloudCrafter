using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class Application : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required Project Project { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }
}
