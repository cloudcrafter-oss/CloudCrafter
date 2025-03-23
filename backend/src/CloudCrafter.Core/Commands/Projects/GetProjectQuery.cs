using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record GetProjectDetailQuery(Guid Id) : IRequest<ProjectDto?>;

public class GetProjectDetailQueryHandler : IRequestHandler<GetProjectDetailQuery, ProjectDto?>
{
    private readonly IProjectsService _service;

    public GetProjectDetailQueryHandler(IProjectsService service)
    {
        _service = service;
    }

    public async Task<ProjectDto?> Handle(
        GetProjectDetailQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _service.GetProject(request.Id);
    }
}
