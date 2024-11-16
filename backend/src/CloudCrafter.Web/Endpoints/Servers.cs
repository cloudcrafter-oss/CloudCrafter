using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Endpoints;

public class Servers : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this).MapGet(GetServers).MapPost(CreateServer).MapGet(GetServerById, "{id}");
    }

    public async Task<List<ServerDto>> GetServers(ISender sender)
    {
        return await sender.Send(new GetServerList.Query());
    }

    [ProducesResponseType<ServerDetailDto>(StatusCodes.Status200OK)]
    public async Task<IResult> GetServerById(ISender sender, Guid id)
    {
        var result = await sender.Send(new GetServerDetail.Query(id));

        if (result == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(result);
    }

    public Task<CreatedServerDto> CreateServer(ISender sender, CreateServerCommand.Command command)
    {
        return sender.Send(command);
    }
}
