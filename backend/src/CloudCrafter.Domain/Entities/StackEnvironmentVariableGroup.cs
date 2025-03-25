using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public class StackEnvironmentVariableGroup : BaseAuditableEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }

    // Relationship with Stack (a group belongs to one stack)
    public Stack Stack { get; set; } = null!;
    public required Guid StackId { get; init; }

    // Relationship with environment variables (a group has many variables)
    public ICollection<StackEnvironmentVariable> EnvironmentVariables { get; set; } =
        new List<StackEnvironmentVariable>();
}
