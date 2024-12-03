using CloudCrafter.Core.Events.DomainEvents.Server;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Events.Handlers.Server;

public class ServerAgentKeyUpdatedEventHandler(
    IAgentManager agentManager,
    ILogger<ServerAgentKeyUpdatedEventHandler> logger
) : INotificationHandler<ServerAgentKeyUpdatedEvent>
{
    public async Task Handle(
        ServerAgentKeyUpdatedEvent notification,
        CancellationToken cancellationToken
    )
    {
        try
        {
            await agentManager.DisconnectAgent(notification.Server.Id);
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Failed to disconnect agent");
        }
    }
}
