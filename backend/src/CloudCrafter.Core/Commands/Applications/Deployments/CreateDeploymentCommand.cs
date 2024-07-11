using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using MediatR;

namespace CloudCrafter.Core.Commands.Applications.Deployments;

public static class CreateDeploymentCommand
{
    public record Query(Guid ApplicationId) : IApplicationCommand, IRequest<Guid>;

    private class Handler(IDeploymentService service) : IRequestHandler<Query, Guid>
    {
        public Task<Guid> Handle(Query request, CancellationToken cancellationToken)
        {
            return service.DeployAsync(request.ApplicationId);
        }
    }
}
