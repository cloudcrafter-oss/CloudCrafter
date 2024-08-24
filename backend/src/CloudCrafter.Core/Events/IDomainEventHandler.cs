namespace CloudCrafter.Core.Events;

public interface IDomainEventHandler<in T> where T : IDomainEvent
{
    Task HandleAsync(T domainEvent);
}
