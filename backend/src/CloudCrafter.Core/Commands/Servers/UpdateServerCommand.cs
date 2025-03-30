using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record UpdateServerCommand(Guid ServerId, UpdateServerDto UpdateDetails)
    : IRequireServerAccess,
        IRequest;

internal class UpdateServerCommandHandler(IServersService serversService)
    : IRequestHandler<UpdateServerCommand>
{
    public Task Handle(UpdateServerCommand request, CancellationToken cancellationToken)
    {
        return serversService.UpdateServer(request.ServerId, request.UpdateDetails);
    }
}
