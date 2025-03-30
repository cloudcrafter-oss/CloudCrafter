using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.SignalR;

public record ServerHealthCheckCommand(Guid ServerId, HealthCheckCommandArgs Data) : IRequest;

internal class ServerHealthCheckCommandHandler(IServerConnectivityService service)
    : IRequestHandler<ServerHealthCheckCommand>
{
    public Task Handle(ServerHealthCheckCommand request, CancellationToken cancellationToken)
    {
        return service.StoreServerInfo(request.ServerId, request.Data);
    }
}
