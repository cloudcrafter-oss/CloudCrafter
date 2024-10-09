using Microsoft.Extensions.Hosting;

namespace CloudCrafter.Jobs.Service.Services;

public class HangfireServerMonitorService(HangfireServerSelector serverSelector) : BackgroundService
{
    private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(15);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            serverSelector.RefreshServerList();

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }
}
