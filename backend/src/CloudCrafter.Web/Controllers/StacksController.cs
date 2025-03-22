using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Commands.Stacks.Providers;
using CloudCrafter.Core.Commands.Stacks.Service;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Domain.Stacks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Controllers;

public class StacksController : CloudCrafterController
{
    [HttpPost]
    public async Task<ActionResult<StackCreatedDto>> PostCreateStack(
        [FromBody] CreateStackCommand.Command command,
        ISender sender
    )
    {
        return await sender.Send(command);
    }

    [HttpPost("provider")]
    public async Task<ActionResult<StackCreatedDto>> PostCreateStackFromSourceProvider(
        [FromBody] CreateStackFromSourceProviderCommand.Command command,
        ISender sender
    )
    {
        return await sender.Send(command);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(StackDetailDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StackDetailDto>> GetStackDetail(
        [FromRoute] Guid id,
        ISender sender
    )
    {
        var details = await sender.Send(new GetStackDetail.Query { StackId = id });
        return details is not null ? Ok(details) : NotFound();
    }

    [HttpPost("{id}/deploy")]
    public async Task<ActionResult<DeploymentCreatedDetailsDto>> PostDispatchStackDeployment(
        [FromRoute] Guid id,
        ISender sender
    )
    {
        return await sender.Send(new DispatchStackDeployment.Command(id));
    }

    [HttpGet("{id}/deployments")]
    public async Task<ActionResult<List<SimpleDeploymentDto>>> GetDeploymentsForStack(
        [FromRoute] Guid id,
        ISender sender
    )
    {
        return await sender.Send(new GetStackSimpleDeployments.Query(id));
    }

    [HttpGet("deployments/{deploymentId}/logs")]
    public async Task<ActionResult<List<DeploymentLogDto>>> GetDeploymentLogs(
        [FromRoute] Guid deploymentId,
        ISender sender
    )
    {
        return await sender.Send(new GetStackDeploymentLogs.Query(deploymentId));
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(StackDetailDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StackDetailDto>> UpdateStack(
        [FromRoute] Guid id,
        [FromBody] UpdateStackCommand.Command command,
        ISender sender
    )
    {
        command = command with { StackId = id };
        var result = await sender.Send(command);
        return result is not null ? Ok(result) : NotFound();
    }

    [HttpPatch("{stackId}/services/{stackServiceId}")]
    public async Task<IActionResult> UpdateStackService(
        [FromRoute] Guid stackId,
        [FromRoute] Guid stackServiceId,
        [FromBody] UpdateStackServiceCommand.Command command,
        ISender sender
    )
    {
        command = command with { StackId = stackId, StackServiceId = stackServiceId };
        var result = await sender.Send(command);

        return result is not null ? Ok(result) : NotFound();
    }

    // Region: Environment Variables
    [HttpGet("{stackId}/environment-variables")]
    public async Task<List<StackEnvironmentVariableDto>> GetEnvironmentVariables(
        ISender sender,
        [FromRoute] Guid stackId,
        [FromQuery] bool includeInherited = false,
        [FromQuery] bool includeSecrets = false
    )
    {
        var result = await sender.Send(
            new GetStackEnvironmentVariablesQuery(stackId, includeInherited, includeSecrets)
        );
        return result;
    }

    [HttpPost("{stackId}/environment-variables")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> PostCreateEnvironmentVariable(
        ISender sender,
        [FromRoute] Guid stackId,
        [FromBody] CreateStackEnvironmentVariableCommand command
    )
    {
        command.StackId = stackId;
        var created = await sender.Send(command);
        return created ? Results.Created() : Results.BadRequest();
    }

    [HttpPut("{stackId}/environment-variables/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> PutUpdateEnvironmentVariable(
        ISender sender,
        [FromRoute] Guid stackId,
        [FromRoute] Guid id,
        [FromBody] UpdateStackEnvironmentVariableCommand command
    )
    {
        command.StackId = stackId;
        command.Id = id;
        var updated = await sender.Send(command);
        return updated ? Results.Ok() : Results.BadRequest();
    }

    [HttpDelete("{stackId}/environment-variables/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> DeleteEnvironmentVariable(
        ISender sender,
        [FromRoute] Guid stackId,
        [FromRoute] Guid id
    )
    {
        var deleted = await sender.Send(new DeleteStackEnvironmentVariableCommand(stackId, id));
        return deleted ? Results.Ok() : Results.BadRequest();
    }

    [HttpPost("{stackId}/environment-variables/templates/{templateId}/apply")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IResult PostApplyTemplate(
        ISender sender,
        [FromRoute] Guid stackId,
        [FromRoute] Guid templateId,
        [FromQuery] bool overrideExisting = false
    )
    {
        // TODO: Implement template application
        // This endpoint will be used to apply a predefined template of environment variables to a stack
        // For now, it returns a not implemented result
        return Results.BadRequest("Template application not yet implemented");
    }

    [HttpGet("{stackId}/environment-variables/history")]
    public List<StackEnvironmentVariableHistoryDto> GetHistory(
        ISender sender,
        [FromRoute] Guid stackId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null
    )
    {
        // TODO: Implement history retrieval
        // This endpoint will be used to get the version history of environment variables for a stack
        // For now, it returns an empty list
        return new List<StackEnvironmentVariableHistoryDto>();
    }

    [HttpPost("{stackId}/environment-variables/import")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IResult PostImportEnvironmentVariables(
        ISender sender,
        [FromRoute] Guid stackId
    // [FromBody] ImportStackEnvironmentVariablesCommand command
    )
    {
        // TODO: Implement import logic
        // This endpoint will be used to import environment variables in bulk
        return Results.BadRequest("Import functionality not yet implemented");
    }

    [HttpGet("{stackId}/environment-variables/export")]
    public IResult GetExportEnvironmentVariables(
        ISender sender,
        [FromRoute] Guid stackId,
        [FromQuery] bool includeSecrets = false
    )
    {
        // TODO: Implement export logic
        // This endpoint will be used to export environment variables
        return Results.BadRequest("Export functionality not yet implemented");
    }
}
