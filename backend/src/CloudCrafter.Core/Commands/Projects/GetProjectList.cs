using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

public static class GetProjectList
{
    [Authorize]
    public record Query(bool IncludeEnvironments) : IRequest<List<ProjectDto>>;

    public class Handler(IProjectsService service) : IRequestHandler<Query, List<ProjectDto>>
    {
        public async Task<List<ProjectDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return await service.GetProjects(
                new LoadProjectOptions { IncludeEnvironments = request.IncludeEnvironments }
            );
        }
    }
}
