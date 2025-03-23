using CloudCrafter.Agent.Models.Configs;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.MediatR.SignalR;
using CloudCrafter.Agent.Runner.SignalR.Providers;
using MediatR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CloudCrafter.Agent.Runner;

public class SocketManager
{
    private readonly AgentConfig _agentConfig;
    private readonly ILogger<SocketManager> _logger;
    private readonly ISender _sender;

    private readonly IHubWrapper _wrapper;
    private readonly IHostApplicationLifetime _applicationLifetime;

    public SocketManager(
        ILogger<SocketManager> logger,
        ISender sender,
        IOptions<AgentConfig> config,
        IHubWrapper hubWrapper,
        IHostApplicationLifetime applicationLifetime
    )
    {
        _logger = logger;
        _agentConfig = config.Value;
        _sender = sender;
        _wrapper = hubWrapper;
        _applicationLifetime = applicationLifetime;
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
                    new AgentHubDeployRecipeCommand(
                        message,
                        _wrapper.TypedHubConnection,
                        message.MessageId
                    )
                );
            }
        );

        _wrapper.On<AgentHubRequestHealthMessage>(
            "AgentHubRequestHealthMessage",
            async message =>
            {
                await _sender.Send(
                    new AgentHubRequestHealthMessageHandler.Query(
                        message,
                        _wrapper.TypedHubConnection
                    )
                );
            }
        );

        _logger.LogDebug("Attached message handlers");
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

        try
        {
            // Wait until the application is stopping
            await Task.Delay(Timeout.Infinite, _applicationLifetime.ApplicationStopping);
        }
        catch (TaskCanceledException)
        {
            // This is expected when the token is canceled
            _logger.LogInformation("Application shutdown requested, exiting...");
        }
    }
}
