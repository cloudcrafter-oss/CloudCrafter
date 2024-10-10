using CloudCrafter.Core.Jobs.Dispatcher.Factory;
using CloudCrafter.Core.Jobs.Hangfire;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Core.Jobs.Stacks;
using Hangfire.States;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public class CloudCrafterDispatcher(
    BackgroundJobFactory jobFactory,
    ILogger<CloudCrafterDispatcher> logger,
    HangfireServerSelector serverSelector
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

    public Task<string> EnqueueJob(IJob job, IState state)
    {
        logger.LogInformation("Dispatching job {Job} to job factory", job.GetType().FullName);

        return jobFactory.CreateAndEnqueueJobAsync<IJob>(job, state);
    }

    public void DispatchJob(string hashId, IJob job)
    {
        var server = serverSelector.GetServerForHash(hashId);
        var state = new EnqueuedState { Queue = server };
        var jobId = EnqueueJob(job, state);
        logger.LogInformation(
            "Job {JobId} dispatched to server {Server} for hashId {HashId}",
            jobId,
            server,
            hashId
        );
    }
}
