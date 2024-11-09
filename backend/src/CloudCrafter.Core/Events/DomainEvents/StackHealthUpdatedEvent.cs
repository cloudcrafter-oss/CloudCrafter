using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Events.DomainEvents;

public class StackHealthUpdatedEvent(Stack stack) : BaseEvent
{
    public Stack Stack { get; } = stack;
}
