using CloudCrafter.Agent.Models.Configs;
using CloudCrafter.Agent.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CloudCrafter.Agent.Runner.SignalR.Providers;

public interface IHubWrapper
{
    TypedHubConnection<IAgentHub> TypedHubConnection { get; }
    void AttachEvents();
    void On<TMessage>(string methodName, Func<TMessage, Task> handler);
    Task StartAsync();
}

public class HubWrapper : IHubWrapper
{
    private readonly HubConnection _connection;
    private readonly ILogger<HubWrapper> _logger;

    public HubWrapper(
        IHubConnectionProvider provider,
        ILogger<HubWrapper> logger,
        IOptions<AgentConfig> config
    )
    {
        var configValue = config.Value;
        _logger = logger;
        _connection = provider.CreateConnection(
            configValue.CloudCrafterHost,
            configValue.ServerId,
            configValue.AgentKey
        );
        TypedHubConnection = new TypedHubConnection<IAgentHub>(_connection);

        // Log.Logger = AgentLoggerConfiguration
        //     .CreateConfiguration()
        //     .CreateLogger();
    }

    public TypedHubConnection<IAgentHub> TypedHubConnection { get; }

    public void AttachEvents()
    {
        _connection.Reconnected += connectionId =>
        {
            _logger.LogInformation("\u2705 Reconnected to the CloudCrafter server!");
            return Task.CompletedTask;
        };

        _connection.Reconnecting += error =>
        {
            _logger.LogInformation("\u267b\ufe0f Reconnecting to the CloudCrafter server...");
            return Task.CompletedTask;
        };

        _connection.Closed += error =>
        {
            if (error != null)
            {
                _logger.LogCritical(error, "\u274c Connection closed due to an error");
            }
            else
            {
                _logger.LogCritical("Connection closed by the CloudCrafter server");
            }

            return Task.CompletedTask;
        };
    }

    public void On<TMessage>(string methodName, Func<TMessage, Task> handler)
    {
        _connection.On<TMessage>(
            methodName,
            async message =>
            {
                _logger.LogInformation(
                    $"Received AgentMessage [{methodName}] ID: {(message as dynamic)?.MessageId}"
                );
                await handler(message);
            }
        );
    }

    public Task StartAsync()
    {
        return _connection.StartAsync();
    }
}
