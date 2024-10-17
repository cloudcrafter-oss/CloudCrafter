using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Jobs.Dispatcher;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Core.Commands.Servers;

public static class DispatchConnectivityChecksCommand
{
    public record Query() : IRequest;

    private class Handler(ICloudCrafterDispatcher dispatcher) : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            await dispatcher.EnqueueConnectivityChecks();
        }
    }
}
