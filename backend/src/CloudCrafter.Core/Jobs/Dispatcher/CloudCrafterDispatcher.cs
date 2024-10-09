using CloudCrafter.Core.Jobs.Dispatcher.Factory;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Core.Jobs.Stacks;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public class CloudCrafterDispatcher(
    BackgroundJobFactory jobFactory,
    ILogger<CloudCrafterDispatcher> logger
) : ICloudCrafterDispatcher
{
    public Task EnqueueConnectivityChecks()
    {
        logger.LogDebug("Dispatching connectivity check to job factory");

        var job = new ConnectivityCheckBackgroundJob();
        return jobFactory.CreateAndEnqueueJobAsync<ConnectivityCheckBackgroundJob>(job);
    }

    public async Task<string> EnqueueStackDeployment(Guid deploymentId)
    {
        logger.LogInformation(
            "Dispatching stack deployment to job factory for deployment {DeploymentId}",
            deploymentId
        );
        var job = new DeployStackBackgroundJob(deploymentId);
        return await jobFactory.CreateAndEnqueueJobAsync<DeployStackBackgroundJob>(job);
    }
}
