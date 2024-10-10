using Hangfire.States;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public interface ICloudCrafterDispatcher
{
    Task EnqueueConnectivityChecks();
    Task<string> EnqueueStackDeployment(Guid deploymentId);

    Task<string> EnqueueJob(IJob job, IState state);

    void DispatchJob(string hashId, IJob job);
}
