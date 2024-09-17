using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Domain.Domain.Deployment;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class DispatchStack
{
    [Authorize]
    public record Command(Guid StackId)
        : IRequest<DeploymentCreatedDetailsDto>,
            IRequireStackAccess;

    private class Handler(IDeploymentService deploymentService)
        : IRequestHandler<Command, DeploymentCreatedDetailsDto>
    {
        public async Task<DeploymentCreatedDetailsDto> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var deploymentId = await deploymentService.DeployAsync(request.StackId);

            return new DeploymentCreatedDetailsDto { DeploymentId = deploymentId };
        }
    }
}
