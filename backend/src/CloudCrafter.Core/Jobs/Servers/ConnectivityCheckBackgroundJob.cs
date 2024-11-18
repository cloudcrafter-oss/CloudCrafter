using System.Diagnostics;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Entities.Jobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Servers;

public class ConnectivityCheckBackgroundJob : IJob
{
    public BackgroundJobType Type => BackgroundJobType.ServerConnectivityCheck;

    public Task HandleEntity(IApplicationDbContext context, string jobId)
    {
        return Task.CompletedTask;
    }

    public Task TearDown()
    {
        return Task.CompletedTask;
    }

    public async Task Handle(
        IServiceProvider serviceProvider,
        IApplicationDbContext context,
        ILoggerFactory loggerFactory,
        string jobId
    )
    {
        var service = serviceProvider.GetRequiredService<IServerConnectivityService>();

        var logger = loggerFactory.CreateLogger<ConnectivityCheckBackgroundJob>();
        logger.LogDebug("Starting connectivity job for all connected servers");

        var stopwatch = Stopwatch.StartNew();

        try
        {
            await service.PerformConnectivityCheckAsync();
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Something went wrong during the connectivity checks");
        }

        stopwatch.Stop();

        var elapsedMs = stopwatch.ElapsedMilliseconds;
        await context.SaveChangesAsync();

        logger.LogInformation("Connectivity job completed in {ElapsedMs}ms", elapsedMs);
    }
}
