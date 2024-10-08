﻿using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Domain.Domain.Project;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Endpoints;

public class Projects : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetProjects)
            .MapPost(CreateProject)
            .MapGet(GetProject, "{id}")
            .MapPost(UpdateProject, "{id}")
            .MapDelete(DeleteProject, "{id}")
            .MapGet(GetProjectEnvironmentEnhanced, "{id}/{environmentId}");
    }

    public async Task<List<ProjectDto>> GetProjects(
        ISender sender,
        [FromQuery] bool includeEnvironments = false
    )
    {
        return await sender.Send(new GetProjectList.Query(includeEnvironments));
    }

    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProjectDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> GetProject([FromRoute] Guid id, ISender sender)
    {
        var project = await sender.Send(new GetProjectQuery.Query(id));

        return project is not null ? Results.Ok(project) : Results.NotFound();
    }

    public async Task<ProjectDto> CreateProject(
        CreateProjectCommand.Command command,
        ISender sender
    )
    {
        return await sender.Send(command);
    }

    public async Task<ProjectDto> UpdateProject(
        [FromRoute] Guid id,
        UpdateProjectArgs args,
        ISender sender
    )
    {
        return await sender.Send(new UpdateProjectCommand.Command(id, args));
    }

    public async Task<IResult> DeleteProject([FromRoute] Guid id, ISender sender)
    {
        await sender.Send(new DeleteProjectCommand.Command(id));

        return Results.Ok();
    }

    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProjectEnvironmentEnhancedDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> GetProjectEnvironmentEnhanced(
        [FromRoute] Guid id,
        [FromRoute] Guid environmentId,
        ISender sender
    )
    {
        var details = await sender.Send(
            new GetProjectEnvironmentEnhancedDetailsQuery.Query
            {
                ProjectId = id,
                EnvironmentId = environmentId,
            }
        );

        return details is not null ? Results.Ok(details) : Results.NotFound();
    }
}
