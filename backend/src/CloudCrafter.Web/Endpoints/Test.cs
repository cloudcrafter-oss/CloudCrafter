using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Core.Commands;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.SignalR;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace CloudCrafter.Web.Endpoints;

public class Test : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(GetTest)
            .MapGet(SendExampleDeployment)
            .MapGet(GetSendExampleMessageToAgent, "agent")
            .MapGet(GetConnectedClients, "connected-clients"); // Add this line
    }

    public async Task GetTest(
        ISender sender,
        IHubContext<MyHub> hub,
        [FromBody] TestCommand.Query query
    )
    {
        await hub.Clients.All.SendAsync("ReceiveMessage", new MyHubMessage { Id = Guid.NewGuid() });
    }

    public async Task GetSendExampleMessageToAgent(IAgentManager manager, [FromQuery] Guid serverId)
    {
        await manager.SendPingToAgent(serverId);
    }

    public IResult GetConnectedClients()
    {
        var connectedClients = new List<string>();
        return Results.Ok(connectedClients);
    }

    public async Task<Guid> SendExampleDeployment(IDeploymentService deploymentService)
    {
        var result = await deploymentService.DeployAsync(
            Guid.Parse("a6512d2d-ee30-4d44-8064-2ae9475e1f16")
        );

        return result;
    }
}
