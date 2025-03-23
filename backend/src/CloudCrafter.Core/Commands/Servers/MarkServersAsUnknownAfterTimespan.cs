using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public record MarkServersAsUnknownAfterTimespanCommand : IRequest;

public class MarkServersAsUnknownAfterTimespanCommandHandler(IServersService serversService)
    : IRequestHandler<MarkServersAsUnknownAfterTimespanCommand>
{
    public Task Handle(
        MarkServersAsUnknownAfterTimespanCommand request,
        CancellationToken cancellationToken
    )
    {
        return serversService.MarkServersStateAsUnknownAfterTimespan(TimeSpan.FromMinutes(5));
    }
}
