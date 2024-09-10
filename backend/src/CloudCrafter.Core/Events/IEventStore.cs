namespace CloudCrafter.Core.Events;

public interface IEventStore
{
    Task PublishAsync<TEvent>(TEvent domainEvent)
        where TEvent : IDomainEvent;
}
