using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using MediatR;

namespace CloudCrafter.Core.Commands.Applications.Deployments;

public record CreateDeploymentCommand(Guid ApplicationId) : IApplicationCommand, IRequest<Guid>;

internal class CreateDeploymentCommandHandler(IDeploymentService service)
    : IRequestHandler<CreateDeploymentCommand, Guid>
{
    public Task<Guid> Handle(CreateDeploymentCommand request, CancellationToken cancellationToken)
    {
        return service.DeployAsync(request.ApplicationId);
    }
}
