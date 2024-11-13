using CloudCrafter.Core.Events.DomainEvents;
using CloudCrafter.Core.SignalR.HubActions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Events.Handlers;

public class StackUpdatedEventHandler(
    ILogger<StackUpdatedEventHandler> logger,
    StackHubActions hubActions
) : INotificationHandler<StackUpdatedEvent>
{
    public Task Handle(StackUpdatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Received StackUpdatedEvent for Stack: {StackId}",
            notification.Stack.Id
        );

        return hubActions.SendFreshStack(notification.Stack.Id);
    }
}
