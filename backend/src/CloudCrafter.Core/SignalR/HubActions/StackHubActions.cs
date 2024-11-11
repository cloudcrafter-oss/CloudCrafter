using AutoMapper;
using CloudCrafter.Core.SignalR.Tracking;
using CloudCrafter.Domain.Domain.Health;
using CloudCrafter.Domain.Entities;
using Microsoft.AspNetCore.SignalR;

namespace CloudCrafter.Core.SignalR.HubActions;

public class StackHubActions(
    IHubContext<StackHub> stackHub,
    PresenceTracker presenceTracker,
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
}
