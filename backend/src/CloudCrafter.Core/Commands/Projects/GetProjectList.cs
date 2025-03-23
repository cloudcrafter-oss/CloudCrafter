using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record GetProjectListQuery(bool IncludeEnvironments) : IRequest<List<ProjectDto>>;

public class GetProjectListQueryHandler(IProjectsService service)
    : IRequestHandler<GetProjectListQuery, List<ProjectDto>>
{
    public async Task<List<ProjectDto>> Handle(
        GetProjectListQuery request,
        CancellationToken cancellationToken
    )
    {
        return await service.GetProjects(
            new LoadProjectOptions { IncludeEnvironments = request.IncludeEnvironments }
        );
    }
}
