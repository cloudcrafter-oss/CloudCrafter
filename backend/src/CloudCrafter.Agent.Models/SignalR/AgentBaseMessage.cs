namespace CloudCrafter.Agent.Models.SignalR;

public abstract class AgentBaseMessage
{
    public required Guid MessageId { get; init; }
}
