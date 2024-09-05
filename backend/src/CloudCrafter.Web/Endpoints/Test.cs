using CloudCrafter.Core.Commands;
using CloudCrafter.Core.SignalR;
using CloudCrafter.Domain.Domain.SignalR;
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
            .MapPost(GetTest);
    }

    public async Task GetTest(ISender sender, IHubContext<MyHub> hub, [FromBody] TestCommand.Query query)
    {
        await hub.Clients.All.SendAsync("ReceiveMessage",
            new MyHubMessage { Id = Guid.NewGuid() });
    }
}
