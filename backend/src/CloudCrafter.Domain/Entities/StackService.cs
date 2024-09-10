using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public class StackService : BaseAuditableEntity
{
    public required Guid StackId { get; init; }
    public required Guid StackServiceTypeId { get; init; }

    public Stack Stack { get; set; } = null!;
    public required EntityHttpConfiguration? HttpConfiguration { get; set; }
    public StackServiceType Type { get; set; } = null!;

    public required string Name { get; init; }

    public required EntityHealthStatus HealthStatus { get; init; }
}
