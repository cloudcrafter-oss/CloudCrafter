namespace CloudCrafter.Agent.Models.SignalR;

public class AgentHubPingMessage : AgentBaseMessage
{
    public required DateTime Timestamp { get; init; }
}
