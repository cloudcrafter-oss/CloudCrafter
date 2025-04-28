using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record CreateServerCommand(string Name) : IRequest<CreatedServerDto>, IRequireTeamWriteAccess
{
    public Guid? TeamId { get; set; }
}

internal class CreateServerCommandHandler(IServersService service)
    : IRequestHandler<CreateServerCommand, CreatedServerDto>
{
    public Task<CreatedServerDto> Handle(
        CreateServerCommand request,
        CancellationToken cancellationToken
    )
    {
        return service.CreateServer(request);
    }
}
