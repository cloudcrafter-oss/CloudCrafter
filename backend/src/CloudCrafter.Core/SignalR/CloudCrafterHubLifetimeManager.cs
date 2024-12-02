using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Protocol;
using Microsoft.AspNetCore.SignalR.StackExchangeRedis;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace CloudCrafter.Core.SignalR;

public class CloudCrafterHubLifetimeManager<THub> : RedisHubLifetimeManager<THub>, IDisposable
    where THub : Hub
{
    private readonly ConcurrentDictionary<string, HubConnectionContext> _connections;
    private readonly ILogger<CloudCrafterHubLifetimeManager<THub>> _logger;

    public CloudCrafterHubLifetimeManager(
        ILogger<CloudCrafterHubLifetimeManager<THub>> logger,
        IOptions<RedisOptions> options,
        IHubProtocolResolver hubProtocolResolver
    )
        : base(logger, options, hubProtocolResolver)
    {
        _connections = new ConcurrentDictionary<string, HubConnectionContext>();
        _logger = logger;
    }

    public override Task OnConnectedAsync(HubConnectionContext connection)
    {
        _connections.TryAdd(connection.ConnectionId, connection);
        _logger.LogInformation(
            "Connection {ConnectionId} added to tracking",
            connection.ConnectionId
        );
        return base.OnConnectedAsync(connection);
    }

    public override Task OnDisconnectedAsync(HubConnectionContext connection)
    {
        _connections.TryRemove(connection.ConnectionId, out _);
        _logger.LogInformation(
            "Connection {ConnectionId} removed from tracking",
            connection.ConnectionId
        );
        return base.OnDisconnectedAsync(connection);
    }

    public List<string> GetConnectionIds()
    {
        return _connections.Keys.ToList();
    }

    public void DisconnectConnection(string connectionId)
    {
        if (_connections.TryGetValue(connectionId, out var connection))
        {
            try
            {
                connection.Abort();
                _logger.LogInformation(
                    "Successfully aborted connection {ConnectionId}",
                    connectionId
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error aborting connection {ConnectionId}", connectionId);
            }
        }
        else
        {
            _logger.LogWarning("Connection {ConnectionId} not found", connectionId);
        }
    }
}
