using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public record MarkServersAsUnknownAfterTimespanCommand : IRequest;

public class MarkServersAsUnknownAfterTimespanCommandHandler
    : IRequestHandler<MarkServersAsUnknownAfterTimespanCommand>
{
    private readonly IServersService _serversService;

    public MarkServersAsUnknownAfterTimespanCommandHandler(IServersService serversService)
    {
        _serversService = serversService;
    }

    public Task Handle(
        MarkServersAsUnknownAfterTimespanCommand request,
        CancellationToken cancellationToken
    )
    {
        return _serversService.MarkServersStateAsUnknownAfterTimespan(TimeSpan.FromMinutes(5));
    }
}
