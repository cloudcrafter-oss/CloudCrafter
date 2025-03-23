using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record RotateServerKeyCommand(Guid ServerId) : IRequest;

internal class RotateServerKeyCommandHandler : IRequestHandler<RotateServerKeyCommand>
{
    private readonly IServersService _service;

    public RotateServerKeyCommandHandler(IServersService service)
    {
        _service = service;
    }

    public async Task Handle(RotateServerKeyCommand request, CancellationToken cancellationToken)
    {
        await _service.RotateServerKey(request.ServerId);
    }
}
