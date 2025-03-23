using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record RotateServerKeyCommand(Guid ServerId) : IRequest;

internal class RotateServerKeyCommandHandler(IServersService service)
    : IRequestHandler<RotateServerKeyCommand>
{
    public async Task Handle(RotateServerKeyCommand request, CancellationToken cancellationToken)
    {
        await service.RotateServerKey(request.ServerId);
    }
}
