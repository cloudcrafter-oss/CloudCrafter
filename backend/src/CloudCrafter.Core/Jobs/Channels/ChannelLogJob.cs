using CloudCrafter.Agent.SignalR.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Channels;

public class ChannelLogJob : ISimpleJob<DeploymentOutputArgs>
{
    public Task HandleAsync(IServiceProvider serviceProvider, DeploymentOutputArgs arg)
    {
        var logger = serviceProvider.GetRequiredService<ILogger<ChannelLogJob>>();

        logger.LogInformation(
            "ChannelLogJob: {ChannelId} {Message}",
            arg.ChannelId,
            arg.Output.Output
        );

        return Task.CompletedTask;
    }
}
