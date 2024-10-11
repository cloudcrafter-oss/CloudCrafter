using CloudCrafter.Agent.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Commands.SignalR;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Jobs.Channels;
using CloudCrafter.Core.Jobs.Dispatcher;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.SignalR;

public class AgentHub(
    IServersService serversService,
    ILogger<AgentHub> logger,
    ConnectedServerManager serverManager,
    ISender sender,
    IHubContext<WebHub> testHub,
    ICloudCrafterDispatcher dispatcher
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
        dispatcher.DispatchJob<ChannelLogJob, DeploymentOutputArgs>(
            args.ChannelId.ToString(),
            args
        );
        await testHub.Clients.All.SendAsync("DeploymentOutput", args);
    }
}
