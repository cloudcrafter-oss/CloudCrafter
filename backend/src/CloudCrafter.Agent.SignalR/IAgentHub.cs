using CloudCrafter.Agent.SignalR.Models;

namespace CloudCrafter.Agent.SignalR;

public interface IAgentHub
{
    Task HealthCheckCommand(HealthCheckCommandArgs args);
}
