using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Requests.Filtering;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Controllers;

public class ServersController : CloudCrafterController
{
    [HttpGet]
    public async Task<List<ServerDto>> GetServers(ISender sender)
    {
        return await sender.Send(new GetServerList.Query());
    }
    
    [HttpPost]
    public Task<CreatedServerDto> CreateServer(ISender sender, CreateServerCommand.Command command)
    {
        return sender.Send(command);
    }

    
    [HttpGet("{id}")]
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
    
    [HttpGet("{id}/deployments")]
    public async Task<PaginatedList<SimpleDeploymentDto>> GetDeploymentsForServer(
        [FromRoute] Guid id,
        [FromQuery] BasePaginationRequest paginationRequest,
        ISender sender
    )
    {
        return await sender.Send(new GetServerSimpleDeployments.Query(id, paginationRequest));
    }
    
}
