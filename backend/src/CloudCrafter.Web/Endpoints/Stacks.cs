﻿using CloudCrafter.Core.Commands.Stacks;
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
            .MapPost(DispatchStackDeployment, "{id}/deploy");
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
        return await sender.Send(new DispatchStack.Command(id));
    }

    public async Task<List<SimpleDeploymentDto>> GetDeploymentsForStack(
        [FromRoute] Guid id,
        ISender sender
    )
    {
        return await sender.Send(new GetStackSimpleDeployments.Query(id));
    }
}
