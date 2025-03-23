using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record DeleteProjectCommand(Guid Id) : IRequest;

internal class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand>
{
    private readonly IProjectsService _service;

    public DeleteProjectCommandHandler(IProjectsService service)
    {
        _service = service;
    }

    public Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        return _service.DeleteProject(request.Id);
    }
}
