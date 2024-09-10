using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

public static class DeleteProjectCommand
{
    [Authorize]
    public record Command(Guid Id) : IRequest;

    private class Handler(IProjectsService service) : IRequestHandler<Command>
    {
        public Task Handle(Command request, CancellationToken cancellationToken)
        {
            return service.DeleteProject(request.Id);
        }
    }
}
