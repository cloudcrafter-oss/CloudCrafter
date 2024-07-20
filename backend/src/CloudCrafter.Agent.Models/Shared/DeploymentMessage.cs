namespace CloudCrafter.Agent.Models.Shared;

public class DeploymentMessage
{
    public required string Message { get; init; }
    public required Type Target { get; set; }
}
