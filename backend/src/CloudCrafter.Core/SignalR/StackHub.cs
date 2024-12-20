using CloudCrafter.Core.SignalR.Tracking;
using Microsoft.AspNetCore.SignalR;

namespace CloudCrafter.Core.SignalR;

public class StackHub(PresenceTracker presenceTracker) : Hub, IPresenceTrackingHub
{
    public string HubName => nameof(StackHub);

    public async Task JoinChannel(string guid)
    {
        // TODO: Validate if bearer has access to stack in the future
        await presenceTracker.ClientJoinedGroup<StackHub>(Context.ConnectionId, guid);
        await Groups.AddToGroupAsync(Context.ConnectionId, guid);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Clean up all group memberships first
        await presenceTracker.CleanupGroupsForConnection<StackHub>(Context.ConnectionId);

        await base.OnDisconnectedAsync(exception);
    }
}
