using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public interface ICloudCrafterDispatcher
{
    Task EnqueueConnectivityChecks();
    Task<string> EnqueueStackDeployment(Guid deploymentId);
}
