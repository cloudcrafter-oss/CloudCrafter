using CloudCrafter.Agent.Models.Configs;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.MediatR.SignalR;
using CloudCrafter.Agent.Runner.SignalR;
using CloudCrafter.Agent.Runner.SignalR.Providers;
using CloudCrafter.Agent.SignalR;
using MediatR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CloudCrafter.Agent.Runner;

public class SocketManager
{
    private readonly AgentConfig _agentConfig;
    private readonly HubConnection _connection;
    private readonly ILogger<SocketManager> _logger;
    private readonly ISender _sender;
    private readonly TypedHubConnection<IAgentHub> _typedHubConnection;
    private readonly IHubConnectionProvider _connectionProvider;

    public SocketManager(
        ILogger<SocketManager> logger,
        ISender sender,
        IOptions<AgentConfig> config,
        IHubConnectionProvider connectionProvider
    )
    {
        _logger = logger;
        _sender = sender;
        _agentConfig = config.Value;
        _connectionProvider = connectionProvider;
        _connection = connectionProvider.CreateConnection(
            _agentConfig.CloudCrafterHost,
            _agentConfig.ServerId,
            _agentConfig.AgentKey
        );

        _typedHubConnection = new TypedHubConnection<IAgentHub>(_connection);

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

            // TODO: Handle this better
            // Environment.Exit(1);
            // return null;
            return Task.CompletedTask;
        };

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

        AttachMessageHandlers();
    }

    private void AttachMessageHandlers()
    {
        _connection.On<AgentHubPingMessage>(
            "AgentHubPingMessage",
            async message =>
            {
                _logger.LogInformation(
                    $"Received AgentMessage [AgentHubPingMessage] ID: {message.MessageId}"
                );

                await _sender.Send(
                    new AgentHubPingMessageHandler.Query(message, _typedHubConnection)
                );
            }
        );

        _connection.On<AgentHubDeployRecipeMessage>(
            "AgentHubDeployRecipeMessage",
            async message =>
            {
                _logger.LogInformation(
                    $"Received AgentMessage [AgentHubDeployRecipeMessage] ID: {message.MessageId}"
                );

                await _sender.Send(
                    new AgentHubDeployRecipeMessageHandler.Command(message, _typedHubConnection)
                );
            }
        );
    }

    public async Task ConnectAsync()
    {
        _logger.LogInformation(
            "Connecting to CloudCrafter upstream server at {Host}...",
            _agentConfig.CloudCrafterHost
        );
        const int maxRetries = 5;
        const int initialBackoffMs = 1000;
        for (var attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                await _connection.StartAsync();
                break; // Connection successful, exit the loop
            }
            catch (Exception)
            {
                if (attempt == maxRetries)
                {
                    throw; // Rethrow the exception if all attempts failed
                }

                _logger.LogWarning(
                    $"Connection attempt {attempt} failed. Retrying in {initialBackoffMs * attempt}ms..."
                );
                await Task.Delay(initialBackoffMs * attempt);
            }
        }

        _logger.LogInformation("Connected to the CloudCrafter servers. Listening for messages...");

        // TODO: Is there a better way for this? We dont want the task to return actually,
        // because that will cause the console application to quit.
        await Task.Delay(Timeout.Infinite);
    }
}
