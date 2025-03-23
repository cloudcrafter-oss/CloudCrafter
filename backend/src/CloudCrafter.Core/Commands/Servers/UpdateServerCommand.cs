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

internal class UpdateServerCommandHandler : IRequestHandler<UpdateServerCommand>
{
    private readonly IServersService _serversService;

    public UpdateServerCommandHandler(IServersService serversService)
    {
        _serversService = serversService;
    }

    public Task Handle(UpdateServerCommand request, CancellationToken cancellationToken)
    {
        return _serversService.UpdateServer(request.ServerId, request.UpdateDetails);
    }
}
