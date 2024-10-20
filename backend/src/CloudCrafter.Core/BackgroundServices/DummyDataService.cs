using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;

namespace CloudCrafter.Core.BackgroundServices;

public class DummyDataService(IHubContext<WebHub> webHub) : BackgroundService
{
    private readonly TimeSpan _waitInterval = TimeSpan.FromSeconds(1);

    private static int _counter = 0;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var args = new DeploymentOutputArgs()
            {
                ChannelId = Guid.Parse("8bda05e9-dafa-4171-baf9-c332a3a82bde"),
                Output = new()
                {
                    InternalOrder = _counter,
                    Date = DateTime.UtcNow,
                    Output = $"This is a test message {_counter}",
                    IsError = _counter % 2 == 0,
                },
            };

            _counter++;
            await webHub.Clients.All.SendAsync("DeploymentOutput", args);

            await Task.Delay(_waitInterval, stoppingToken);
        }
    }
}
