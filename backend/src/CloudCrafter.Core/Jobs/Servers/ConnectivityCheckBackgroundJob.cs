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
    private Server? _server;

    public ConnectivityCheckBackgroundJob() { }

    public ConnectivityCheckBackgroundJob(Guid serverId)
    {
        ServerId = serverId;
    }

    public Guid ServerId { get; set; }

    private BackgroundJob? _job { get; set; }
    public BackgroundJobType Type => BackgroundJobType.ServerConnectivityCheck;
    public bool ShouldRunOnApiServer => false;

    public async Task HandleEntity(IApplicationDbContext context, string jobId)
    {
        _server = await context.Servers.FindAsync(ServerId);
        if (_server == null)
        {
            throw new ArgumentNullException(nameof(ServerId), "Server not found");
        }

        _job = await context.Jobs.Where(x => x.HangfireJobId == jobId).FirstOrDefaultAsync();

        if (_job == null)
        {
            throw new ArgumentNullException(nameof(jobId), "Job not found");
        }
        await context.SaveChangesAsync();
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
        if (_job == null || _server == null)
        {
            throw new ArgumentNullException("Job or server is null - this should never happen!");
        }

        var service = serviceProvider.GetRequiredService<IServerConnectivityService>();

        var logger = loggerFactory.CreateLogger<ConnectivityCheckBackgroundJob>();
        logger.LogDebug(
            "Starting connectivity job for server ({ServerId}) with hostname ({Hostname})",
            _server.Id,
            _server.IpAddress
        );

        var stopwatch = Stopwatch.StartNew();

        try
        {
            await service.PerformConnectivityCheckAsync(_server.Id);
            logger.LogInformation("Connectivity to ({ServerName}) is healthy", _server.Name);
        }
        catch (Exception ex)
        {
            logger.LogCritical(
                ex,
                "Something went wrong during the connectivity check for server ({ServerId}) ({ServerName})",
                _server.Id,
                _server.Name
            );
        }

        stopwatch.Stop();

        var elapsedMs = stopwatch.ElapsedMilliseconds;
        await context.SaveChangesAsync();

        logger.LogInformation("Connectivity job completed in {ElapsedMs}ms", elapsedMs);
    }
}
