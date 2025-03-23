using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record DeleteProjectCommand(Guid Id) : IRequest;

internal class DeleteProjectCommandHandler(IProjectsService service)
    : IRequestHandler<DeleteProjectCommand>
{
    public Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteProject(request.Id);
    }
}
