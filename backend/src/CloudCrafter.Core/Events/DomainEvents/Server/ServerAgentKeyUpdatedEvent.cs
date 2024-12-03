using CloudCrafter.Domain.Common;

namespace CloudCrafter.Core.Events.DomainEvents.Server;

public class ServerAgentKeyUpdatedEvent(Domain.Entities.Server server) : BaseEvent
{
    public Domain.Entities.Server Server { get; } = server;
}
