using Microsoft.AspNetCore.SignalR;

namespace CloudCrafter.Core.SignalR;

public class StackHub : Hub
{
    public async Task JoinChannel(string guid)
    {
        // TODO: Validate if bearer has access to stack in the future
        await Groups.AddToGroupAsync(Context.ConnectionId, guid);
    }
}
