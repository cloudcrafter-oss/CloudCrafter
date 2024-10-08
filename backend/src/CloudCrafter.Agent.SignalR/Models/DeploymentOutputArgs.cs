namespace CloudCrafter.Agent.SignalR.Models;

public class DeploymentOutputArgs
{
    public required Guid ChannelId { get; init; }
    public required string Output { get; init; }
}
