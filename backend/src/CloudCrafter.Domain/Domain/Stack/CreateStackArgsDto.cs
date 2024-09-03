namespace CloudCrafter.Domain.Domain.Stack;

public class CreateStackArgsDto
{
    public required string Name { get; init; }
    public required Guid EnvironmentId { get; set; }
    public required Guid ServerId { get; set; }
    public string? GitRepository { get; set; }
}
