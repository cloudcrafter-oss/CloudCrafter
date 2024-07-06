using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Web.Infrastructure;
using MediatR;

namespace CloudCrafter.Web.Endpoints;

public class Servers : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetServers);
    }

    public async Task<List<ServerDto>> GetServers(ISender sender)
    {
        return await sender.Send(new GetServerList.Query());
    }
}
