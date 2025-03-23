using CloudCrafter.Core.Jobs.Dispatcher;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public record DispatchConnectivityChecksCommand : IRequest;

internal class DispatchConnectivityChecksCommandHandler(ICloudCrafterDispatcher dispatcher)
    : IRequestHandler<DispatchConnectivityChecksCommand>
{
    public async Task Handle(
        DispatchConnectivityChecksCommand request,
        CancellationToken cancellationToken
    )
    {
        await dispatcher.EnqueueConnectivityChecks();
    }
}
