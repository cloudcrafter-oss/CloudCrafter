﻿using System.Text.Json;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Domain.Entities;

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
            
            ServerConnectivityCheckJob = new ()
            {
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Id = Guid.NewGuid(),
                Server = parameter
            }
        };

        return Task.FromResult(backgroundJob);

    }
}
