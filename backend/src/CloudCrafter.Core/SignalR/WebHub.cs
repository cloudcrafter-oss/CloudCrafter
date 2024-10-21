using Microsoft.AspNetCore.SignalR;

namespace CloudCrafter.Core.SignalR;

public class WebHub : Hub
{
    public Task JoinChannel(string guid)
    {
        return Groups.AddToGroupAsync(Context.ConnectionId, guid);
    }
}
