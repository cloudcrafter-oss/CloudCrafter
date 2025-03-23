using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record DeleteServerCommand(Guid ServerId) : IRequest;

internal class DeleteServerCommandHandler : IRequestHandler<DeleteServerCommand>
{
    private readonly IServersService _service;

    public DeleteServerCommandHandler(IServersService service)
    {
        _service = service;
    }

    public async Task Handle(DeleteServerCommand request, CancellationToken cancellationToken)
    {
        await _service.DeleteServer(request.ServerId);
    }
}
