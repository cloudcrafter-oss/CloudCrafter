using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

public static class GetProjectEnvironmentEnhancedDetailsQuery
{
    [Authorize]
    public record Query(Guid ProjectId, Guid EnvironmentId) : IRequest<ProjectEnvironmentEnhancedDto?>;
    
    private class Handler(IProjectsService service): IRequestHandler<Query, ProjectEnvironmentEnhancedDto?>
    {
        public Task<ProjectEnvironmentEnhancedDto?> Handle(Query request, CancellationToken cancellationToken)
        {
            return service.GetProjectEnvironmentEnhancedDetails(request.ProjectId, request.EnvironmentId);
        }
    }
}
