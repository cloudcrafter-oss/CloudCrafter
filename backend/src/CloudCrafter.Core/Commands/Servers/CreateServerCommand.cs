using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public static class CreateServerCommand
{
    [Authorize]
    public record Command(string Name) : IRequest<CreatedServerDto>;

    private class Handler(IServersService service) : IRequestHandler<Command, CreatedServerDto>
    {
        public Task<CreatedServerDto> Handle(Command request, CancellationToken cancellationToken)
        {
            return service.CreateServer(request);
        }
    }
}
