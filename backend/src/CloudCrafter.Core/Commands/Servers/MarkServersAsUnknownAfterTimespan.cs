using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public static class MarkServersAsUnknownAfterTimespan
{
    public record Command : IRequest;

    public class Handler(IServersService serversService) : IRequestHandler<Command>
    {
        public Task Handle(Command request, CancellationToken cancellationToken)
        {
            return serversService.MarkServersStateAsUnknownAfterTimespan(TimeSpan.FromMinutes(5));
        }
    }
}
