using Microsoft.AspNetCore.SignalR;

namespace CloudCrafter.Core.SignalR;

public class StackHub : Hub
{
    public Task JoinChannel(string guid)
    {
        // TODO: Validate if bearer has access to stack in the future
        return Groups.AddToGroupAsync(Context.ConnectionId, guid);
    }
}
