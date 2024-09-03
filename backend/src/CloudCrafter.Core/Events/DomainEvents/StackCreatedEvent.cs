using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Events.DomainEvents;

public class StackCreatedEvent(Stack stack) : BaseEvent
{
    public Stack Stack { get; } = stack;
}
