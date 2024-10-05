using CloudCrafter.Agent.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Commands.SignalR;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.SignalR;

public class AgentHub(
    IServersService serversService,
    ILogger<AgentHub> logger,
    ConnectedServerManager serverManager,
    ISender sender,
    IHubContext<TestHub> testHub
) : CloudCrafterBaseHub(serversService, logger, serverManager), IAgentHub
{
    public async Task HealthCheckCommand(HealthCheckCommandArgs args)
    {
        var serverId = await GetServerForClient();

        logger.LogCritical("Received HealthCheckCommand from server {ServerId}", serverId);

        await sender.Send(new ServerHealthCheckCommand.Command(serverId, args));
    }

    public async Task DeploymentOutput(DeploymentOutputArgs args)
    {
        await testHub.Clients.All.SendAsync("DeploymentOutput", args);
    }
}
