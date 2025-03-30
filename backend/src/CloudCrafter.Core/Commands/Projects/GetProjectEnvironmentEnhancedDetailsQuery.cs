using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public class GetProjectEnvironmentEnhancedDetailsQuery
    : IRequest<ProjectEnvironmentEnhancedDto?>,
        IRequireEnvironmentAccess,
        IRequireProjectAccess
{
    // TODO: Add tests for IRequireEnvironmentAccess, IRequireProjectAccess
    public required Guid EnvironmentId { get; init; }
    public required Guid ProjectId { get; init; }
}

internal class GetProjectEnvironmentEnhancedDetailsQueryHandler(IProjectsService service)
    : IRequestHandler<GetProjectEnvironmentEnhancedDetailsQuery, ProjectEnvironmentEnhancedDto?>
{
    public Task<ProjectEnvironmentEnhancedDto?> Handle(
        GetProjectEnvironmentEnhancedDetailsQuery request,
        CancellationToken cancellationToken
    )
    {
        return service.GetProjectEnvironmentEnhancedDetails(
            request.ProjectId,
            request.EnvironmentId
        );
    }
}
