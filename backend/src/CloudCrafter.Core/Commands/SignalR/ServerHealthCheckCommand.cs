using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.SignalR;

public static class ServerHealthCheckCommand
{
    public record Command(Guid ServerId, HealthCheckCommandArgs Data) : IRequest;

    private class Handler(IServerConnectivityService service) : IRequestHandler<Command>
    {
        public Task Handle(Command request, CancellationToken cancellationToken)
        {
            return service.StoreServerInfo(request.ServerId, request.Data);
        }
    }
}
