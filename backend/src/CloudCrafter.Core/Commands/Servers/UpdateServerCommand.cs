using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public static class UpdateServerCommand
{
    [Authorize]
    public record Command(Guid ServerId, UpdateServerDto UpdateDto)
        : IRequireServerAccess,
            IRequest;

    public class Handler(IServersService serversService) : IRequestHandler<Command>
    {
        public Task Handle(Command request, CancellationToken cancellationToken)
        {
            return serversService.UpdateServer(request.ServerId, request.UpdateDto);
        }
    }
}
