using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Events.Store;

public class EventStore(IServiceProvider serviceProvider, ILogger<EventStore> logger) : IEventStore
{
    public async Task PublishAsync<TEvent>(TEvent domainEvent) where TEvent : IDomainEvent
    {
        using var scope = serviceProvider.CreateScope();
        var handlers = scope.ServiceProvider.GetServices<IDomainEventHandler<TEvent>>();

        foreach (var handler in handlers)
        {
            try
            {
                await handler.HandleAsync(domainEvent);
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "Error handling event {Event}", domainEvent);
                throw;
            }
        }
    }
}
