using System.Diagnostics;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Entities.Jobs;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Servers;

public class ConnectivityCheckBackgroundJob(IServerConnectivityService serverConnectivity) : IBaseJob<Server>
{
    public string JobName => "Server Connectivity Job";
    public BackgroundJobType Type => BackgroundJobType.ServerConnectivityCheck;

    public async Task ExecuteAsync(BackgroundJob backgroundJob, Server server, ILoggerFactory loggerFactory)
    {
        if (backgroundJob.ServerConnectivityCheckJob == null)
        {
            throw new ArgumentException("Background job is missing the ServerConnectivityCheckJob property.");
        }

        var logger = loggerFactory.CreateLogger<ConnectivityCheckBackgroundJob>();
        logger.LogDebug("Starting connectivity job for server ({ServerId})", server.Id);


        var stopwatch = Stopwatch.StartNew();

        try
        {
            await serverConnectivity.PerformConnectivityCheckAsync(server.Id);
            backgroundJob.ServerConnectivityCheckJob.Result = ServerConnectivityCheckResult.Healthy;
        }
        catch (Exception ex)
        {
            backgroundJob.ServerConnectivityCheckJob.Result = ServerConnectivityCheckResult.Unhealthy;
            logger.LogCritical(ex, "Something went wrong during the connectivity check for server ({ServerId})",
                server.Id);
        }

        stopwatch.Stop();

        var elapsedMs = stopwatch.ElapsedMilliseconds;
        backgroundJob.ServerConnectivityCheckJob.TimeTakenMs = elapsedMs;

        logger.LogInformation("Deployment job completed in {ElapsedMs}ms", elapsedMs);
    }
}
