using CloudCrafter.Agent.SignalR.Models;
using Microsoft.AspNetCore.SignalR;
using Polly;

namespace CloudCrafter.Core.SignalR.HubActions;

public class WebHubActions(IHubContext<WebHub> webHub)
{
    public Task SendDeploymentOutput(Guid channelId, DeploymentOutputArgs args)
    {
        return webHub.Clients.Group(channelId.ToString()).SendAsync("DeploymentOutput", args);
    }
}
