using CloudCrafter.Core.Events.DomainEvents;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.SignalR.HubActions;
using CloudCrafter.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Events.Handlers;

public class StackHealthUpdatedEventHandler(
    ILogger<StackHealthUpdatedEventHandler> logger,
    StackHubActions hubActions
) : INotificationHandler<StackHealthUpdatedEvent>
{
    public Task Handle(StackHealthUpdatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Received StackHealthUpdatedEvent for Stack: {StackId}",
            notification.Stack.Id
        );

        return hubActions.SendStackHealthUpdate(notification.Stack);
    }
}
