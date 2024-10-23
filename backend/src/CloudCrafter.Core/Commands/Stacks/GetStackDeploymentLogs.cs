using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Domain.Domain.Deployment;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class GetStackDeploymentLogs
{
    // TODO: Implement ACL checks somewhere
    //  [Authorize]
    public record Query(Guid DeploymentId) : IRequest<List<DeploymentLogDto>>;

    public record Handler(IDeploymentService deploymentService)
        : IRequestHandler<Query, List<DeploymentLogDto>>
    {
        public async Task<List<DeploymentLogDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return await deploymentService.GetDeploymentLogs(request.DeploymentId);
        }
    }
}
