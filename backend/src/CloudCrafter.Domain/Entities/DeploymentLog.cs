namespace CloudCrafter.Domain.Entities;

public class DeploymentLog
{
    public required string Log { get; init; }
    public required bool IsError { get; init; }
    public required DateTime Date { get; init; }
    public required int Index { get; set; }
}
