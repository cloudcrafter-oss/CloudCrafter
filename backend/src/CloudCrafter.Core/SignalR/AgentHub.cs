using CloudCrafter.Agent.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.SignalR;

public class AgentHub(
    IServersService serversService,
    ILogger<AgentHub> logger,
    ConnectedServerManager serverManager
) : CloudCrafterBaseHub(serversService, logger, serverManager), IAgentHub
{
    public Task HealthCheckCommand(HealthCheckCommandArgs args)
    {
        var serverId = GetServerForClient();

        logger.LogCritical(
            "Received TestCommand from server {ServerId} with value: {Value}",
            serverId,
            args
        );

        return Task.CompletedTask;
    }
}
