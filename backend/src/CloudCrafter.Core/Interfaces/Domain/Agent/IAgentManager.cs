namespace CloudCrafter.Core.Interfaces.Domain.Agent;

public interface IAgentManager
{
    Task SendPingToAgent(Guid serverId);
}
