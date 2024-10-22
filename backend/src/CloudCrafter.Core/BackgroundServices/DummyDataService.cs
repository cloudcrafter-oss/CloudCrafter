using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.SignalR;
using CloudCrafter.Core.SignalR.HubActions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;

namespace CloudCrafter.Core.BackgroundServices;

public class DummyDataService(WebHubActions webHubActions) : BackgroundService
{
    private readonly TimeSpan _waitInterval = TimeSpan.FromMilliseconds(600);

    private static int _counter = 0;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var args = new DeploymentOutputArgs()
            {
                ChannelId = Guid.Parse("12fa115d-9b23-4400-9fa9-24d1631ff33d"),
                Output = new()
                {
                    InternalOrder = _counter,
                    Date = DateTime.UtcNow,
                    Output = $"This is a test message {_counter}",
                    IsError = _counter % 2 == 0,
                },
            };

            await webHubActions.SendDeploymentOutput(args.ChannelId, args);
            _counter++;
            await Task.Delay(_waitInterval, stoppingToken);
        }
    }
}
