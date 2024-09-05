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
    public ConnectivityCheckBackgroundJob()
    {
    }

    public ConnectivityCheckBackgroundJob(Guid serverId)
    {
        ServerId = serverId;
    }

    public Guid ServerId { get; set; }
    public BackgroundJobType Type => BackgroundJobType.ServerConnectivityCheck;


    public async Task Handle(IServiceProvider serviceProvider, ILoggerFactory loggerFactory, string jobId)
    {
        var context = serviceProvider.GetRequiredService<IApplicationDbContext>(); // TODO: Move this to a service

        var job = await context.Jobs.Where(x => x.HangfireJobId == jobId).FirstOrDefaultAsync();

        if (job == null)
        {
            throw new ArgumentNullException("Job not found");
        }

        var connectivityCheckJob = new ServerConnectivityCheckJob
        {
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Result = ServerConnectivityCheckResult.Unknown,
            Id = Guid.NewGuid(),
            ServerId = ServerId
        };

        context.ServerConnectivityCheckJobs.Add(connectivityCheckJob);
        job.ServerConnectivityCheckJobId= connectivityCheckJob.Id;
        await context.SaveChangesAsync();


        var server = await context.Servers.FindAsync(ServerId);
        if (server == null)
        {
            throw new ArgumentNullException("Server not found");
        }

        var service = serviceProvider.GetRequiredService<IServerConnectivityService>();
        await ExecuteAsync(job, service, server, loggerFactory);
    }

    private async Task ExecuteAsync(BackgroundJob backgroundJob, IServerConnectivityService serverConnectivity,
        Server server, ILoggerFactory loggerFactory)
    {
        if (backgroundJob.ServerConnectivityCheckJob == null)
        {
            var message = "Background job is missing the ServerConnectivityCheckJob property.";
            throw new ArgumentException(message);
        }

        var logger = loggerFactory.CreateLogger<ConnectivityCheckBackgroundJob>();
        logger.LogDebug("Starting connectivity job for server ({ServerId}) with hostname ({Hostname})", server.Id,
            server.IpAddress);


        var stopwatch = Stopwatch.StartNew();

        try
        {
            await serverConnectivity.PerformConnectivityCheckAsync(server.Id);
            backgroundJob.ServerConnectivityCheckJob.Result = ServerConnectivityCheckResult.Healthy;
            logger.LogInformation("Connectivity to ({ServerName}) is healthy", server.Name);
        }
        catch (Exception ex)
        {
            backgroundJob.ServerConnectivityCheckJob.Result = ServerConnectivityCheckResult.Unhealthy;
            logger.LogCritical(ex,
                "Something went wrong during the connectivity check for server ({ServerId}) ({ServerName})",
                server.Id, server.Name);
        }

        stopwatch.Stop();

        var elapsedMs = stopwatch.ElapsedMilliseconds;
        backgroundJob.ServerConnectivityCheckJob.TimeTakenMs = elapsedMs;

        logger.LogInformation("Connectivity job completed in {ElapsedMs}ms", elapsedMs);
    }
}
