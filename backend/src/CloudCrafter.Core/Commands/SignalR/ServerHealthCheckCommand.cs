using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.SignalR;

public record ServerHealthCheckCommand(Guid ServerId, HealthCheckCommandArgs Data) : IRequest;

internal class ServerHealthCheckCommandHandler : IRequestHandler<ServerHealthCheckCommand>
{
    private readonly IServerConnectivityService _service;

    public ServerHealthCheckCommandHandler(IServerConnectivityService service)
    {
        _service = service;
    }

    public Task Handle(ServerHealthCheckCommand request, CancellationToken cancellationToken)
    {
        return _service.StoreServerInfo(request.ServerId, request.Data);
    }
}
