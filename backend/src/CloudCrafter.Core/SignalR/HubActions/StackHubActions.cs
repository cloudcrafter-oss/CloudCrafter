using AutoMapper;
using CloudCrafter.Domain.Domain.Health;
using CloudCrafter.Domain.Entities;
using Microsoft.AspNetCore.SignalR;

namespace CloudCrafter.Core.SignalR.HubActions;

public class StackHubActions(IHubContext<StackHub> stackHub, IMapper mapper)
{
    public Task SendStackHealthUpdate(Stack stack)
    {
        var hasConnectedClients = stackHub.Clients.Group(stack.Id.ToString());
        var mappedDto = mapper.Map<EntityHealthDto>(stack.HealthStatus);

        return stackHub
            .Clients.Group(stack.Id.ToString())
            .SendAsync("StackHealthUpdate", mappedDto);
    }
}
