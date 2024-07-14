using System.Text.Json;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Entities.Jobs;

namespace CloudCrafter.Core.Jobs.Creation;

public class ConnectivityCheckCreationStrategy : IJobCreationStrategy<ConnectivityCheckBackgroundJob, Server>
{
    public Task<BackgroundJob> CreateJobAsync(Server parameter)
    {
        var backgroundJob = new BackgroundJob
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Status = BackgroundJobStatus.Created,
            SerializedArguments = JsonSerializer.Serialize(parameter),
            HangfireJobId = string.Empty,
            Type = BackgroundJobType.ServerConnectivityCheck,
            ServerConnectivityCheckJob = new ServerConnectivityCheckJob
            {
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Result = ServerConnectivityCheckResult.Unknown,
                Id = Guid.NewGuid(),
                ServerId = parameter.Id
            }
        };

        return Task.FromResult(backgroundJob);
    }
}
