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
    public Task SendPingToAgents()
    {
        var message = new AgentHubPingMessage
        {
            MessageId = Guid.NewGuid(),
            Timestamp = DateTime.UtcNow,
        };

        return SendMessage(message);
    }

    public Task SendRecipeToAgent(Guid serverId, Guid deploymentId, DeploymentRecipe recipe)
    {
        var message = new AgentHubDeployRecipeMessage
        {
            MessageId = deploymentId,
            Timestamp = DateTime.UtcNow,
            Recipe = recipe,
            DeploymentId = deploymentId,
        };

        return SendMessage(message, serverId);
    }

    private async Task SendMessage(AgentBaseMessage message, Guid? serverId = null)
    {
        var name = message.GetType().Name;
        if (!serverId.HasValue)
        {
            // Send to all clients
            logger.LogDebug(
                "Sending message of type {Type} to all connected clients",
                message.GetType()
            );
            await hub.Clients.All.SendAsync(name, message);
            return;
        }
        var connectedClientId = await GetConnectedClientIdForServer(serverId.Value);

        if (connectedClientId is null)
        {
            logger.LogDebug(
                "Attempting to send message of type {Type} to server {ServerId}, but no connected clients",
                message.GetType(),
                serverId
            );
            return;
        }

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
