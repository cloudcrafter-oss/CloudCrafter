using CloudCrafter.Agent.Models.Configs;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.MediatR.SignalR;
using CloudCrafter.Agent.Runner.SignalR.Providers;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CloudCrafter.Agent.Runner;

public class SocketManager
{
    private readonly AgentConfig _agentConfig;
    private readonly ILogger<SocketManager> _logger;
    private readonly ISender _sender;

    private readonly IHubWrapper _wrapper;

    public SocketManager(
        ILogger<SocketManager> logger,
        ISender sender,
        IOptions<AgentConfig> config,
        IHubWrapper hubWrapper
    )
    {
        _logger = logger;
        _sender = sender;
        _agentConfig = config.Value;
        _wrapper = hubWrapper;
        AttachMessageHandlers();
    }

    private void AttachMessageHandlers()
    {
        _wrapper.On<AgentHubPingMessage>(
            "AgentHubPingMessage",
            async message =>
            {
                await _sender.Send(
                    new AgentHubPingMessageHandler.Query(
                        message,
                        _wrapper.TypedHubConnection,
                        Guid.NewGuid()
                    )
                );
            }
        );

        _wrapper.On<AgentHubDeployRecipeMessage>(
            "AgentHubDeployRecipeMessage",
            async message =>
            {
                await _sender.Send(
                    new AgentHubDeployRecipeMessageHandler.Command(
                        message,
                        _wrapper.TypedHubConnection,
                        message.MessageId
                    )
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
                await _wrapper.StartAsync();
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
