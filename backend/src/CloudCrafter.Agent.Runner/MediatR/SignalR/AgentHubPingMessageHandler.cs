using CloudCrafter.Agent.Models.SignalR;
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
        TypedHubConnection<IAgentHub> TypedHubConnection
    ) : IRequest;

    private class Handler(ILogger<Handler> logger) : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            logger.LogDebug("Received message in agent handler");
            await request.TypedHubConnection.InvokeAsync(hub =>
                hub.HealthCheckCommand(new HealthCheckCommandArgs { Timestamp = DateTime.UtcNow })
            );
        }
    }
}
