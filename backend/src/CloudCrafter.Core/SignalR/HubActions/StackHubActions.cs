using AutoMapper;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.SignalR.Tracking;
using CloudCrafter.Domain.Domain.Health;
using CloudCrafter.Domain.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Core.SignalR.HubActions;

public class StackHubActions(
    IHubContext<StackHub> stackHub,
    PresenceTracker presenceTracker,
    IServiceProvider serviceProvider,
    IMapper mapper
)
{
    public async Task SendStackHealthUpdate(Stack stack)
    {
        var connectedClients = await presenceTracker.ConnectedClientsForGroup<StackHub>(
            stack.Id.ToString()
        );

        if (connectedClients == 0)
        {
            return;
        }

        var mappedDto = mapper.Map<EntityHealthDto>(stack.HealthStatus);

        await stackHub.Clients.Group(stack.Id.ToString()).SendAsync("StackHealthUpdate", mappedDto);
    }

    public async Task SendFreshStack(Guid stackId)
    {
        var connectedClients = await presenceTracker.ConnectedClientsForGroup<StackHub>(
            stackId.ToString()
        );

        if (connectedClients == 0)
        {
            return;
        }

        var stacksService = serviceProvider.GetRequiredService<IStacksService>();

        var stack = await stacksService.GetStackDetail(stackId);

        if (stack == null)
        {
            // This should not even be remotely possible, but just in case
            return;
        }

        await stackHub.Clients.Group(stackId.ToString()).SendAsync("StackUpdated", stack);
    }
}
