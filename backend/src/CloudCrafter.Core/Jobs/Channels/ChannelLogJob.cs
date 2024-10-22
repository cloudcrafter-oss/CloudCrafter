using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Channels;

public class ChannelLogJob(DeploymentOutputArgs args) : ISimpleJob
{
    public DeploymentOutputArgs Args => args;

    public async Task HandleAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILogger<ChannelLogJob>>();
        var deploymentService = serviceProvider.GetRequiredService<IDeploymentService>();
        logger.LogInformation(
            "Saving message to deployment service, deploymentId: {DeploymentId}",
            args.ChannelId
        );

        await deploymentService.StoreDeploymentLogAsync(Args.ChannelId, Args.Output);
    }
}
