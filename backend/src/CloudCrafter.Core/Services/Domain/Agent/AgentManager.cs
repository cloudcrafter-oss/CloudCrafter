using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Agent;

public class AgentManager(
    IHubContext<AgentHub> hub,
    ILogger<AgentManager> logger,
    ConnectedServerManager connectedServerManager
) : IAgentManager
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

    public Task SendRecipeToAgent(Guid serverId, DeploymentRecipe recipe)
    {
        var message = new AgentHubDeployRecipeMessage
        {
            MessageId = Guid.NewGuid(),
            Timestamp = DateTime.UtcNow,
            Recipe = recipe,
        };

        return SendMessage(message, serverId);
    }

    private async Task SendMessage(AgentBaseMessage message, Guid serverId)
    {
        var connectedClientId = await GetConnectedClientIdForServer(serverId);

        if (connectedClientId is null)
        {
            logger.LogDebug(
                "Attempting to send message of type {Type} to server {ServerId}, but no connected clients",
                message.GetType(),
                serverId
            );
            return;
        }

        var name = message.GetType().Name;
        logger.LogDebug(
            "Sending message of type {Type} to client {ClientId}",
            message.GetType(),
            connectedClientId
        );
        await hub.Clients.Client(connectedClientId).SendAsync(name, message);
    }

    private async Task<string?> GetConnectedClientIdForServer(Guid serverId)
    {
        var connectedAgents = await connectedServerManager.GetConnectionIdForServer(serverId);

        return connectedAgents;
    }
}
