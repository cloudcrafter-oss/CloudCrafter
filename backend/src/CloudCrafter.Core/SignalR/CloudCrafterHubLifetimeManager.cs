using System.Buffers;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using MessagePack;
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
    private const string DisconnectChannel = "cloudcrafter:disconnect";
    private readonly SemaphoreSlim _connectionLock = new SemaphoreSlim(1);

    private readonly ISubscriber _subscriber;

    public CloudCrafterHubLifetimeManager(
        ILogger<CloudCrafterHubLifetimeManager<THub>> logger,
        IOptions<RedisOptions> options,
        IHubProtocolResolver hubProtocolResolver,
        ISubscriber subscriber
    )
        : base(logger, options, hubProtocolResolver)
    {
        _connections = new ConcurrentDictionary<string, HubConnectionContext>();
        _logger = logger;

        _subscriber = subscriber;
        _ = EnsureRedisServerConnection();
    }

    private async Task EnsureRedisServerConnection()
    {
        var channel = await _subscriber.SubscribeAsync(RedisChannel.Literal(DisconnectChannel));

        channel.OnMessage(channelMessage =>
        {
            var message = JsonSerializer.Deserialize<SignalRDisconnectClientCommand>(
                channelMessage.Message!
            );
            // var message = ReadSignalRDisconnectClientCommand(channelMessage.Message);

            if (message == null)
            {
                return;
            }

            DisconnectConnection(message.ConnectionId);
        });
    }

    public async Task RequestDisconnect(string connectionId)
    {
        try
        {
            var command = new SignalRDisconnectClientCommand() { ConnectionId = connectionId };

            var value = JsonSerializer.Serialize(command);

            await _subscriber.PublishAsync(
                RedisChannel.Literal(DisconnectChannel),
                new RedisValue(value)
            );
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Error publishing disconnect message");
        }
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

    private void DisconnectConnection(string connectionId)
    {
        if (!_connections.TryGetValue(connectionId, out var connection))
        {
            // We should return as current server does not hold websocket connection
            return;
        }

        try
        {
            connection.Abort();
            _logger.LogInformation("Successfully aborted connection {ConnectionId}", connectionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error aborting connection {ConnectionId}", connectionId);
        }
    }

    public class SignalRDisconnectClientCommand
    {
        public required string ConnectionId { get; set; }
    }

    public static SignalRDisconnectClientCommand ReadSignalRDisconnectClientCommand(
        ReadOnlyMemory<byte> data
    )
    {
        var reader = new MessagePackReader(data);

        if (reader.ReadArrayHeader() != 1)
        {
            throw new InvalidDataException("Invalid message");
        }

        var connectionId = reader.ReadString()!;

        return new SignalRDisconnectClientCommand() { ConnectionId = connectionId };
    }
}
