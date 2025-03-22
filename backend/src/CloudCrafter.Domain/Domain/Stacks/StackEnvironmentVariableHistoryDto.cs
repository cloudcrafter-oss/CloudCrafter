using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Stacks;

public class StackEnvironmentVariableHistoryDto
{
    public Guid Id { get; set; }
    public Guid StackId { get; set; }
    public Guid EnvironmentVariableId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public bool IsSecret { get; set; }
    public EnvironmentVariableType Type { get; set; }
    public string ChangeType { get; set; } = string.Empty; // Created, Updated, Deleted
    public string? GroupName { get; set; }
    public DateTime Timestamp { get; set; }
    public string? UserId { get; set; }
    public string? UserName { get; set; }
}
