using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.SignalR;

public class ConnectedServerManager(IDistributedCache cache, ILogger<ConnectedServerManager> logger)
{
    public async Task<Guid?> GetServerIdForConnectionId(string connectionId)
    {
        var serverId = await cache.GetStringAsync($"connection:{connectionId}");
        if (serverId is null)
        {
            logger.LogDebug("No server found for connection {ConnectionId}", connectionId);
            return null;
        }

        logger.LogDebug(
            "Found server {ServerId} for connection {ConnectionId}",
            serverId,
            connectionId
        );
        return Guid.Parse(serverId);
    }

    public async Task<string?> GetConnectionIdForServer(Guid serverId)
    {
        var connectionId = await cache.GetStringAsync($"server:{serverId}");
        if (connectionId is null)
        {
            logger.LogDebug("No connection found for server {ServerId}", serverId);
            return null;
        }

        logger.LogDebug(
            "Found connection {ConnectionId} for server {ServerId}",
            connectionId,
            serverId
        );
        return connectionId;
    }

    public async Task RemoveConnection(string connectionId)
    {
        var serverId = await cache.GetStringAsync($"connection:{connectionId}");
        if (serverId != null)
        {
            await cache.RemoveAsync($"connection:{connectionId}");
            await cache.RemoveAsync($"server:{serverId}");
            logger.LogDebug(
                "Removed connection {ConnectionId} for server {ServerId}",
                connectionId,
                serverId
            );
        }
    }

    public async Task SaveConnection(Guid serverId, string connectionId)
    {
        await cache.SetStringAsync($"server:{serverId}", connectionId);
        await cache.SetStringAsync($"connection:{connectionId}", serverId.ToString());
        logger.LogDebug(
            "Saved connection {ConnectionId} for server {ServerId}",
            connectionId,
            serverId
        );
    }
}
