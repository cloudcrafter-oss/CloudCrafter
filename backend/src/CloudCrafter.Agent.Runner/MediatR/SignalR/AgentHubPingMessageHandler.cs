using CloudCrafter.Agent.Models.SignalR;
using MediatR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.MediatR.SignalR;

public static class AgentHubPingMessageHandler
{
    public record Query(AgentHubPingMessage Message, HubConnection Hub) : IRequest;

    private class Handler(ILogger<AgentHubPingMessageHandler.Handler> logger)
        : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            logger.LogDebug("Received message in agent handler");
            await request.Hub.SendAsync("TestCommand", "hello", cancellationToken);
        }
    }
}
