using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Domain.Domain.Project;
using CloudCrafter.Web.Infrastructure;
using MediatR;

namespace CloudCrafter.Web.Endpoints;

public class Projects : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetProjects);
    }

    public async Task<List<ProjectDto>> GetProjects(ISender sender)
    {
        return await sender.Send(new GetProjectList.Query());
    }
}
