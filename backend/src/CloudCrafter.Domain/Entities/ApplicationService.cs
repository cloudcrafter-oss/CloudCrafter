using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class ApplicationService : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required Guid ApplicationId { get; init; }
    public required Guid ApplicationServiceTypeId { get; init; }

    public Application Application { get; set; } = null!;
    public ApplicationServiceType Type { get; set; } = null!;

    public required string Name { get; init; }

    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }
}
