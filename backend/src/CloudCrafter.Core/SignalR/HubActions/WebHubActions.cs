using AutoMapper;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Domain.Domain.Deployment;
using Microsoft.AspNetCore.SignalR;
using Polly;

namespace CloudCrafter.Core.SignalR.HubActions;

public class WebHubActions(IHubContext<WebHub> webHub, IMapper mapper)
{
    public Task SendDeploymentOutput(Guid channelId, DeploymentOutputArgs args)
    {
        var mappedDto = mapper.Map<DeploymentLogDto>(args.Output);
        return webHub.Clients.Group(channelId.ToString()).SendAsync("DeploymentOutput", mappedDto);
    }
}
