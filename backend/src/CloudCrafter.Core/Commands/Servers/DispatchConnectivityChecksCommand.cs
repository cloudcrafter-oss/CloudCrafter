using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Jobs.Dispatcher;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Core.Commands.Servers;

public static class DispatchConnectivityChecksCommand
{
    public record Query() : IRequest;

    private class Handler(ICloudCrafterDispatcher dispatcher, IApplicationDbContext context)
        : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            var servers = await context.Servers.ToListAsync(cancellationToken); // TOOD: move to service or something, fine for now
            await dispatcher.EnqueueConnectivityCheck(servers);
        }
    }
}
