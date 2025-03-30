using System.Collections.Generic;
using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public class StackEnvironmentVariable : BaseAuditableEntity
{
    public Stack Stack { get; set; } = null!;
    public required Guid StackId { get; set; }
    public required string Key { get; set; }
    public required string Value { get; set; }
    public bool IsSecret { get; set; }
    public EnvironmentVariableType Type { get; set; } = EnvironmentVariableType.Both;

    // Optional reference to a group (can be null for standalone variables)
    public StackEnvironmentVariableGroup? Group { get; set; }
    public Guid? GroupId { get; set; }
}

public enum EnvironmentVariableType
{
    BuildTime,
    Runtime,
    Both,
}
