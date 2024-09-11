using CloudCrafter.Core.Events.DomainEvents;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Events.Handlers;

public class StackCreatedEventHandler(
    ILogger<StackCreatedEventHandler> logger,
    IStackServicesService stackServicesService
) : INotificationHandler<StackCreatedEvent>
{
    public async Task Handle(StackCreatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("Stack created: {StackId}", notification.Stack.Id);

        if (notification.Stack.BuildPack == StackBuildPack.Nixpacks)
        {
            await HandleNixpacks(notification.Stack);
        }
    }

    private async Task HandleNixpacks(Stack stack)
    {
        logger.LogInformation("Adding default App service to stack: {StackId}", stack.Id);

        await stackServicesService.AddAppServiceToStack(stack.Id, "Default");

        logger.LogInformation("Default App service added to stack: {StackId}", stack.Id);
    }
}
