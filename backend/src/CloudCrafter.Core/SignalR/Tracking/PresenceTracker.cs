using System.Text.Json;
using StackExchange.Redis;

namespace CloudCrafter.Core.SignalR.Tracking;

public class PresenceTracker(IConnectionMultiplexer redis)
{
    private const string PRESENCE_KEY_PREFIX = "presence";
    private const string GROUP_KEY_PREFIX = "group";

    private string GetPresenceSetKey(string hubName) =>
        $"{PRESENCE_KEY_PREFIX}:{hubName}:connectedClients";

    private string GetPresenceHashKey(string hubName) =>
        $"{PRESENCE_KEY_PREFIX}:{hubName}:clientDetails";

    private string GetGroupMembersKey(string hubName, string groupId) =>
        $"{GROUP_KEY_PREFIX}:{hubName}:group:{groupId}:members";

    private string GetClientGroupsKey(string hubName, string connectionId) =>
        $"{GROUP_KEY_PREFIX}:{hubName}:client:{connectionId}:groups";

    public async Task ClientJoinedGroup<THub>(string connectionId, string groupId)
        where THub : IPresenceTrackingHub
    {
        var hubName = typeof(THub).Name;
        var db = redis.GetDatabase();

        // Add client to group members set
        await db.SetAddAsync(GetGroupMembersKey(hubName, groupId), connectionId);

        // Add group to client's groups set
        await db.SetAddAsync(GetClientGroupsKey(hubName, connectionId), groupId);

        // Update client details with group information
        var userKey = $"{connectionId}";
        var userData = new HashEntry[]
        {
            new HashEntry("connectionId", connectionId),
            new HashEntry("lastSeen", DateTime.UtcNow.ToString("O")),
            new HashEntry("currentGroup", groupId),
        };

        await db.HashSetAsync(
            GetPresenceHashKey(hubName),
            userKey,
            JsonSerializer.Serialize(userData)
        );
    }

    public async Task ClientLeftGroup<THub>(string connectionId, string groupId)
        where THub : IPresenceTrackingHub
    {
        var hubName = typeof(THub).Name;
        var db = redis.GetDatabase();

        // Remove client from group members
        await db.SetRemoveAsync(GetGroupMembersKey(hubName, groupId), connectionId);

        // Remove group from client's groups
        await db.SetRemoveAsync(GetClientGroupsKey(hubName, connectionId), groupId);
    }

    public async Task<IEnumerable<string>> GroupsForConnection<THub>(string connectionId)
        where THub : IPresenceTrackingHub
    {
        var hubName = typeof(THub).Name;
        var db = redis.GetDatabase();

        var groupMembers = await db.SetMembersAsync(GetClientGroupsKey(hubName, connectionId));
        return groupMembers.Select(g => g.ToString());
    }

    public async Task<IEnumerable<string>> ClientsForGroupId<THub>(string groupId)
        where THub : IPresenceTrackingHub
    {
        var hubName = typeof(THub).Name;
        var db = redis.GetDatabase();

        var members = await db.SetMembersAsync(GetGroupMembersKey(hubName, groupId));
        return members.Select(m => m.ToString());
    }

    public async Task CleanupGroupsForConnection<THub>(string connectionId)
        where THub : IPresenceTrackingHub
    {
        var hubName = typeof(THub).Name;
        var db = redis.GetDatabase();

        // Get all groups the user was part of
        var userGroups = await GroupsForConnection<THub>(connectionId);

        // Remove user from each group
        foreach (var groupId in userGroups)
        {
            await ClientLeftGroup<THub>(connectionId, groupId);
        }

        // Clean up the client's groups set
        await db.KeyDeleteAsync(GetClientGroupsKey(hubName, connectionId));
    }
}
