using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record GetProjectDetailQuery(Guid Id) : IRequest<ProjectDto?>;

public class GetProjectDetailQueryHandler(IProjectsService service)
    : IRequestHandler<GetProjectDetailQuery, ProjectDto?>
{
    public async Task<ProjectDto?> Handle(
        GetProjectDetailQuery request,
        CancellationToken cancellationToken
    )
    {
        return await service.GetProject(request.Id);
    }
}
