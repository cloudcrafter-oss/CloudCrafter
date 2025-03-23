using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Jobs.Dispatcher;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Core.Commands.Servers;

public record DispatchConnectivityChecksCommand() : IRequest;

internal class DispatchConnectivityChecksCommandHandler
    : IRequestHandler<DispatchConnectivityChecksCommand>
{
    private readonly ICloudCrafterDispatcher _dispatcher;

    public DispatchConnectivityChecksCommandHandler(ICloudCrafterDispatcher dispatcher)
    {
        _dispatcher = dispatcher;
    }

    public async Task Handle(
        DispatchConnectivityChecksCommand request,
        CancellationToken cancellationToken
    )
    {
        await _dispatcher.EnqueueConnectivityChecks();
    }
}
