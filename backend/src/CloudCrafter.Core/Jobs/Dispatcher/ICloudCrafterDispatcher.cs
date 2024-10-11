namespace CloudCrafter.Core.Jobs.Dispatcher;

public interface ICloudCrafterDispatcher
{
    Task EnqueueConnectivityChecks();
    Task<string> EnqueueStackDeployment(Guid deploymentId);
    void DispatchJob<TJob, TArg>(string hashId, TArg arg)
        where TJob : ISimpleJob<TArg>;
}
