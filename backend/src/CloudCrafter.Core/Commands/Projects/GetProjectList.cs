using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record GetProjectListQuery(bool IncludeEnvironments) : IRequest<List<ProjectDto>>;

public class GetProjectListQueryHandler : IRequestHandler<GetProjectListQuery, List<ProjectDto>>
{
    private readonly IProjectsService _service;

    public GetProjectListQueryHandler(IProjectsService service)
    {
        _service = service;
    }

    public async Task<List<ProjectDto>> Handle(
        GetProjectListQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _service.GetProjects(
            new LoadProjectOptions { IncludeEnvironments = request.IncludeEnvironments }
        );
    }
}
