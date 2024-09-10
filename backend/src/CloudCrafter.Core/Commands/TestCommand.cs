using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Jobs.Service;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Core.Commands;

public static class TestCommand
{
    public record Query(bool Fail) : IRequest;

    private class Handler(ICloudCrafterDispatcher dispatcher, IApplicationDbContext context)
        : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            // var server = await context.Servers.FirstOrDefaultAsync(x => x.IpAddress == "127.0.0.1", cancellationToken);
            //
            // if (server == null)
            // {
            //     throw new ArgumentException("Server not found", nameof(server));
            // }

            var servers = await context.Servers.ToListAsync(cancellationToken);
            await dispatcher.EnqueueConnectivityCheck(servers);
        }
    }
}
