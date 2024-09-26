using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.MediatR.SignalR;
using MediatR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;
using Polly;

namespace CloudCrafter.Agent.Runner;

public class SocketManager
{
    private readonly HubConnection _connection = new HubConnectionBuilder()
        .WithUrl(
            "http://web.127.0.0.1.sslip.io/hub/agent?agentId=ffcdd9ee-ff31-4344-a3ab-efdc9b5e44f1&agentKey=vHh7mZ5ntR"
        )
        .Build();

    private readonly ILogger<SocketManager> _logger;
    private readonly ISender _sender;

    public SocketManager(ILogger<SocketManager> logger, ISender sender)
    {
        this._logger = logger;
        this._sender = sender;

        _connection.Closed += error =>
        {
            if (error != null)
            {
                this._logger.LogCritical(error, "Connection closed due to an error");
            }
            else
            {
                this._logger.LogCritical("Connection closed by the CloudCrafter server");
            }

            // TODO: Handle this better
            Environment.Exit(1);
            return null;
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

                await _sender.Send(new AgentHubPingMessageHandler.Query(message, _connection));
            }
        );
    }

    public async Task ConnectAsync()
    {
        _logger.LogInformation("Connecting to CloudCrafter upstream server");
        await _connection.StartAsync();
        _logger.LogInformation("Connected to the CloudCrafter servers. Listening for messages...");

        // TODO: Is there a better way for this? We dont want the task to return actually,
        // because that will cause the console application to quit.
        await Task.Delay(Timeout.Infinite);
    }
}
