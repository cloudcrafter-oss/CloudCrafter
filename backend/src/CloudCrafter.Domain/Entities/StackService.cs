using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class StackService : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required Guid StackId { get; init; }
    public required Guid StackServiceTypeId { get; init; }

    public Stack Stack { get; set; } = null!;
    public StackServiceType Type { get; set; } = null!;

    public required string Name { get; init; }

    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }
}
