using System.Text.Json;
using System.Text.Json.Serialization;
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

    public void DispatchJob(ISimpleJob job, string? hashId = null)
    {
        if (string.IsNullOrEmpty(hashId))
        {
            jobFactory.DispatchJob(job, new EnqueuedState());
            return;
        }
        var server = serverSelector.GetServerForHash(hashId);
        var state = new EnqueuedState { Queue = server };
        // var jobId = EnqueueJob<TJob>(job, state);
        // logger.LogInformation(
        //     "Job {JobId} dispatched to server {Server} for hashId {HashId}",
        //     jobId,
        //     server,
        //     hashId
        // );
    }

    public Task<string> EnqueueJob<TJob>(IJob job, IState state)
        where TJob : IJob
    {
        logger.LogInformation("Dispatching job {Job} to job factory", job.GetType().FullName);

        return jobFactory.CreateAndEnqueueJobAsync<TJob>(job);
    }
}
