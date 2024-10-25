using CloudCrafter.Agent.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Commands.SignalR;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Jobs.Channels;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Core.SignalR.HubActions;
using CloudCrafter.Domain.Domain.Deployment;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.SignalR;

public class AgentHub(
    IServersService serversService,
    ILogger<AgentHub> logger,
    ConnectedServerManager serverManager,
    ISender sender,
    ICloudCrafterDispatcher dispatcher,
    IDeploymentService deploymentService,
    WebHubActions webHubActions
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
        var job = new ChannelLogJob(args);
        dispatcher.DispatchJob(job, args.ChannelId.ToString());
        await webHubActions.SendDeploymentOutput(args.ChannelId, args);
    }

    public Task MarkDeploymentStarted(Guid deploymentId)
    {
        return deploymentService.MarkDeployment(deploymentId, DeploymentStatusDto.Running);
    }

    public Task MarkDeploymentFinished(Guid deploymentId)
    {
        return deploymentService.MarkDeployment(deploymentId, DeploymentStatusDto.Succeeded);
    }

    public Task MarkDeploymentFailed(Guid deploymentId)
    {
        return deploymentService.MarkDeployment(deploymentId, DeploymentStatusDto.Failed);
    }
}
