﻿using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.MediatR.SignalR;
using CloudCrafter.Agent.Runner.SignalR;
using CloudCrafter.Agent.SignalR;
using MediatR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner;

public class SocketManager
{
    private readonly HubConnection _connection = new HubConnectionBuilder()
        .WithUrl(
            "http://web:8080/hub/agent?agentId=ffcdd9ee-ff31-4344-a3ab-efdc9b5e44f1&agentKey=vHh7mZ5ntR"
        )
        .WithAutomaticReconnect()
        .Build();

    private readonly ILogger<SocketManager> _logger;
    private readonly ISender _sender;
    private readonly TypedHubConnection<IAgentHub> _typedHubConnection;

    public SocketManager(ILogger<SocketManager> logger, ISender sender)
    {
        _logger = logger;
        _sender = sender;
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
            "AgentMessage",
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
    }

    public async Task ConnectAsync()
    {
        _logger.LogInformation("Connecting to CloudCrafter upstream server");
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
