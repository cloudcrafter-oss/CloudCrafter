using CloudCrafter.Core.Commands.Projects;
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
            .MapPatch("{id}", PatchProject);
    }

    public async Task<List<ProjectDto>> GetProjects(ISender sender)
    {
        return await sender.Send(new GetProjectList.Query());
    }

    public async Task<ProjectDto> CreateProject(CreateProjectCommand.Command command, ISender sender)
    {
        return await sender.Send(command);
    }

    public async Task<ProjectDto> PatchProject([FromRoute] Guid id, UpdateProjectPatchArgs args, ISender sender)
    {
        return await sender.Send(new UpdateProjectCommand.Command(id, args));
    }
}
