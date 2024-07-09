namespace CloudCrafter.DeploymentEngine.Domain.Commands;

public class ExecutedCommandDetails
{
    public required string Command { get; init; }
    public required string Result { get; init; }
    public required int? ExitStatus { get; init; }
}
