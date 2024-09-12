using CloudCrafter.Core.Common.Interfaces;
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

    public Task HandleEntity(IApplicationDbContext context, string jobId)
    {
        throw new NotImplementedException();
    }

    public Task Handle(
        IServiceProvider serviceProvider,
        IApplicationDbContext context,
        ILoggerFactory loggerFactory,
        string jobId
    )
    {
        var logger = loggerFactory.CreateLogger<DeployStackBackgroundJob>();
        logger.LogDebug("Starting deployment for stack ({StackId})", StackId);

        return Task.CompletedTask;
    }
}
