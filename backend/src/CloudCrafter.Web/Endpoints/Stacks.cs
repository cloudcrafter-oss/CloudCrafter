using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Endpoints;

public class Stacks : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(PostCreateStack)
            .MapGet(GetStackDetail, "{id}")
            .MapGet(GetDeploymentsForStack, "{id}/deployments")
            .MapGet(GetDeploymentLogs, "deployments/{deploymentId}/logs")
            .MapPost(DispatchStackDeployment, "{id}/deploy")
            .MapPut(UpdateStack, "{id}");
    }

    public async Task<StackCreatedDto> PostCreateStack(
        CreateStackCommand.Command command,
        ISender sender
    )
    {
        return await sender.Send(command);
    }

    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(StackDetailDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> GetStackDetail([FromRoute] Guid id, ISender sender)
    {
        var details = await sender.Send(new GetStackDetail.Query { StackId = id });
        return details is not null ? Results.Ok(details) : Results.NotFound();
    }

    public async Task<DeploymentCreatedDetailsDto> DispatchStackDeployment(
        [FromRoute] Guid id,
        ISender sender
    )
    {
        return await sender.Send(new DispatchStackDeployment.Command(id));
    }

    public async Task<List<SimpleDeploymentDto>> GetDeploymentsForStack(
        [FromRoute] Guid id,
        ISender sender
    )
    {
        return await sender.Send(new GetStackSimpleDeployments.Query(id));
    }

    public async Task<List<DeploymentLogDto>> GetDeploymentLogs(
        [FromRoute] Guid deploymentId,
        ISender sender
    )
    {
        return await sender.Send(new GetStackDeploymentLogs.Query(deploymentId));
    }

    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(StackDetailDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> UpdateStack(
        [FromRoute] Guid id,
        [FromBody] UpdateStackCommand.Command command,
        ISender sender
    )
    {
        command = command with { StackId = id };
        var result = await sender.Send(command);
        return result is not null ? Results.Ok(result) : Results.NotFound();
    }
}
