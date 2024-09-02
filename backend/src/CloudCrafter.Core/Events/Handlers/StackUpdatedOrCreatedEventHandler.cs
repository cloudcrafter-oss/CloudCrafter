using CloudCrafter.Core.Events.DomainEvents;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Events.Handlers;

public class StackUpdatedOrCreatedEventHandler(ILogger<StackUpdatedOrCreatedEventHandler> logger) : INotificationHandler<StackUpdatedOrCreatedEvent>
{
    public Task Handle(StackUpdatedOrCreatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("Stack updated or created: {StackId}", notification.Stack.Id);

        return Task.CompletedTask;
    }
}
