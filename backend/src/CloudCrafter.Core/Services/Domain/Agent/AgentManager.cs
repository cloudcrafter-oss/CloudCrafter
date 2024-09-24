using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Agent;

public class AgentManager(IHubContext<AgentHub> hub, ILogger<AgentManager> logger) : IAgentManager
{
    public Task SendPingToAgent(Guid serverId)
    {
        var message = new AgentHubPingMessage
        {
            MessageId = Guid.NewGuid(),
            Timestamp = DateTime.UtcNow,
        };

        return SendMessage(message, serverId);
    }

    private async Task SendMessage(AgentBaseMessage message, Guid serverId)
    {
        var connectedClients = GetConnectedClientIdsForServer(serverId);

        if (connectedClients.Count == 0)
        {
            logger.LogDebug(
                "Attempting to send message of type {Type} to server {ServerId}, but no connected clients",
                message.GetType(),
                serverId
            );
            return;
        }

        foreach (var clientId in connectedClients)
        {
            logger.LogDebug(
                "Sending message of type {Type} to client {ClientId}",
                message.GetType(),
                clientId
            );
            await hub.Clients.Client(clientId).SendAsync("AgentMessage", message);
        }
    }

    private List<string> GetConnectedClientIdsForServer(Guid serverId)
    {
        var connectedAgents = AgentHub
            .ConnectedClients.Select(client => client.Key.ToString())
            .ToList();

        return connectedAgents;
    }
}
