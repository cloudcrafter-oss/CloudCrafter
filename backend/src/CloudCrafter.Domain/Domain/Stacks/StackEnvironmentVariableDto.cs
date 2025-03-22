using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Stacks;

public class StackEnvironmentVariableDto
{
    public Guid Id { get; set; }
    public Guid StackId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public bool IsSecret { get; set; }
    public EnvironmentVariableType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public string? GroupName { get; set; }
    public bool IsInherited { get; set; }
}
