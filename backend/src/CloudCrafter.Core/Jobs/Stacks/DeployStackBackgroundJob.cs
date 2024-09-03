using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Stacks;

public class DeployStackBackgroundJob : IBaseJob<Guid>
{
    public string JobName => "Stack Deployment";
    public BackgroundJobType Type => BackgroundJobType.ServerConnectivityCheck;

    public Task ExecuteAsync(BackgroundJob backgroundJob, Guid stackId, ILoggerFactory loggerFactory)
    {
        var logger = loggerFactory.CreateLogger<DeployStackBackgroundJob>();
        logger.LogDebug("Starting deployment for stack ({StackId})", stackId);
        
        return Task.CompletedTask;
    }
}
