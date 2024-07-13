using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Entities.Jobs;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Servers;

public class ConnectivityCheckBackgroundJob : IBaseJob<Server>
{
    public string JobName => "Server Connectivity Job";
    public BackgroundJobType Type => BackgroundJobType.ServerConnectivityCheck;

    public Task ExecuteAsync(BackgroundJob backgroundJob, Server server, ILoggerFactory loggerFactory)
    {
        var logger = loggerFactory.CreateLogger<ConnectivityCheckBackgroundJob>();
        logger.LogInformation("Starting connectivity job for server {ServerName} ({ServerId})", server.Name, server.Id);

        backgroundJob.ServerConnectivityCheckJob = new ServerConnectivityCheckJob
        {
            Server = server, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, Id = Guid.NewGuid()
        };

        logger.LogInformation("Deployment job completed");

        return Task.CompletedTask;
    }
}
