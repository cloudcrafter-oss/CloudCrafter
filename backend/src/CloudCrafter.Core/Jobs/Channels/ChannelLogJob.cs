using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Channels;

public class ChannelLogJob(DeploymentOutputArgs args) : IJob
{
    public BackgroundJobType Type => BackgroundJobType.ChannelLogJob;
    public bool ShouldRunOnApiServer => false;

    public Task HandleEntity(IApplicationDbContext context, string jobId)
    {
        return Task.CompletedTask;
    }

    public Task TearDown()
    {
        return Task.CompletedTask;
    }

    public Task Handle(
        IServiceProvider serviceProvider,
        IApplicationDbContext context,
        ILoggerFactory loggerFactory,
        string jobId
    )
    {
        var logger = serviceProvider.GetRequiredService<ILogger<ChannelLogJob>>();

        logger.LogInformation("Received log line from channel {ChannelId}", args.ChannelId);
        throw new NotImplementedException();
    }
}
