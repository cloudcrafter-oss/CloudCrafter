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
