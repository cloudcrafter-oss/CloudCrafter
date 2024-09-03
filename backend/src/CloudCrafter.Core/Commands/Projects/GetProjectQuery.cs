using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

public static class GetProjectQuery
{
    [Authorize]
    public record Query(Guid Id) : IRequest<ProjectDto?>;

    public class Handler(IProjectsService service) : IRequestHandler<Query, ProjectDto?>
    {
        public async Task<ProjectDto?> Handle(Query request, CancellationToken cancellationToken)
        {
            return await service.GetProject(request.Id);
        }
    }
}
