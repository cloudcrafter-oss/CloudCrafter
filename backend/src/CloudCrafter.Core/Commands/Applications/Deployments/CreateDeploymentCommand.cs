using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using MediatR;

namespace CloudCrafter.Core.Commands.Applications.Deployments;

public record CreateDeploymentCommand(Guid ApplicationId) : IApplicationCommand, IRequest<Guid>;

internal class CreateDeploymentCommandHandler : IRequestHandler<CreateDeploymentCommand, Guid>
{
    private readonly IDeploymentService _service;

    public CreateDeploymentCommandHandler(IDeploymentService service)
    {
        _service = service;
    }

    public Task<Guid> Handle(CreateDeploymentCommand request, CancellationToken cancellationToken)
    {
        return _service.DeployAsync(request.ApplicationId);
    }
}
