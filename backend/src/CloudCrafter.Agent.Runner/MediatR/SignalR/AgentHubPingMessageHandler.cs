using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.Common.Interfaces;
using CloudCrafter.Agent.Runner.Services;
using CloudCrafter.Agent.Runner.SignalR;
using CloudCrafter.Agent.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.MediatR.SignalR;

public static class AgentHubPingMessageHandler
{
    public record Query(
        AgentHubPingMessage Message,
        TypedHubConnection<IAgentHub> TypedHubConnection,
        Guid ChannelId
    ) : IRequest, IAgentLoggable;

    private class Handler(ILogger<Handler> logger, HostInfoService service) : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            logger.LogDebug("Received message in agent handler");

            var hostInfo = await service.GetHostInfo();
            await request.TypedHubConnection.InvokeAsync(hub =>
                hub.HealthCheckCommand(
                    new HealthCheckCommandArgs { Timestamp = DateTime.UtcNow, HostInfo = hostInfo }
                )
            );
        }
    }
}
