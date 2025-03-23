using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record CreateServerCommand(string Name) : IRequest<CreatedServerDto>;

internal class CreateServerCommandHandler : IRequestHandler<CreateServerCommand, CreatedServerDto>
{
    private readonly IServersService _service;

    public CreateServerCommandHandler(IServersService service)
    {
        _service = service;
    }

    public Task<CreatedServerDto> Handle(
        CreateServerCommand request,
        CancellationToken cancellationToken
    )
    {
        return _service.CreateServer(request);
    }
}
