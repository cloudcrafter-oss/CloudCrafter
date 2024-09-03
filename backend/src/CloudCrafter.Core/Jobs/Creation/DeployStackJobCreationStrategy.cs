using System.Text.Json;
using CloudCrafter.Core.Jobs.Stacks;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Jobs.Creation;

public class DeployStackJobCreationStrategy : IJobCreationStrategy<DeployStackBackgroundJob, Guid>
{
    public Task<BackgroundJob> CreateJobAsync(Guid parameter)
    {
        var backgroundJob = new BackgroundJob
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Status = BackgroundJobStatus.Created,
            SerializedArguments = JsonSerializer.Serialize(parameter),
            HangfireJobId = string.Empty,
            Type = BackgroundJobType.StackDeployment
        };

        return Task.FromResult(backgroundJob);
    }
}
