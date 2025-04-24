using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record DeleteServerCommand(Guid ServerId) : IRequest;

internal class DeleteServerCommandHandler(IServersService service)
    : IRequestHandler<DeleteServerCommand>
{
    public async Task Handle(DeleteServerCommand request, CancellationToken cancellationToken)
    {
        await service.DeleteServer(request.ServerId);
    }
}
