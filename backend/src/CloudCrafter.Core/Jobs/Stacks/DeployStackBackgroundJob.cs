using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Stacks;

public class DeployStackBackgroundJob : IJob
{
    public DeployStackBackgroundJob() { }

    public DeployStackBackgroundJob(Guid stackId)
    {
        StackId = stackId;
    }

    public Guid StackId { get; set; }

    public BackgroundJobType Type => BackgroundJobType.StackDeployment;

    public Task Handle(IServiceProvider serviceProvider, ILoggerFactory loggerFactory, string jobId)
    {
        var logger = loggerFactory.CreateLogger<DeployStackBackgroundJob>();
        logger.LogDebug("Starting deployment for stack ({StackId})", StackId);

        return Task.CompletedTask;
    }
}
