using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Domain.Domain.Deployment;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class DispatchStack
{
    [Authorize]
    public record Command(Guid StackId) : IRequest<DeploymentCreatedDetailsDto>, IRequireStackAccess;

    private class Handler(ICloudCrafterDispatcher dispatcher) : IRequestHandler<Command, DeploymentCreatedDetailsDto>
    {
        public async Task<DeploymentCreatedDetailsDto> Handle(Command request, CancellationToken cancellationToken)
        {
            var deploymentId = await dispatcher.EnqueueStackDeployment(request.StackId);

            return new DeploymentCreatedDetailsDto { DeploymentId = deploymentId };
        }
    }
}
