using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

public static class GetProjectEnvironmentEnhancedDetailsQuery
{
    [Authorize]
    public class Query
        : IRequest<ProjectEnvironmentEnhancedDto?>,
            IRequireEnvironmentAccess,
            IRequireProjectAccess
    {
        // TODO: Add tests for IRequireEnvironmentAccess, IRequireProjectAccess
        public required Guid EnvironmentId { get; init; }
        public required Guid ProjectId { get; init; }
    }

    private class Handler(IProjectsService service)
        : IRequestHandler<Query, ProjectEnvironmentEnhancedDto?>
    {
        public Task<ProjectEnvironmentEnhancedDto?> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return service.GetProjectEnvironmentEnhancedDetails(
                request.ProjectId,
                request.EnvironmentId
            );
        }
    }
}
