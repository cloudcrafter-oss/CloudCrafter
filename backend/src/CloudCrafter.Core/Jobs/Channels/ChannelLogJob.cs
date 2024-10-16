using CloudCrafter.Agent.SignalR.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Channels;

public class ChannelLogJob(DeploymentOutputArgs args) : ISimpleJob
{
    public DeploymentOutputArgs Args => args;

    public Task HandleAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILogger<ChannelLogJob>>();

        logger.LogInformation(
            "ChannelLogJob: {ChannelId} {Message}",
            args.ChannelId,
            args.Output.Output
        );

        return Task.CompletedTask;
    }
}
