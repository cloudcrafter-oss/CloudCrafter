using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public interface ICloudCrafterDispatcher
{
    Task<string> EnqueueConnectivityCheck(Server server);
    Task EnqueueConnectivityCheck(List<Server> servers);
    Task<string> EnqueueStackDeployment(Guid deploymentId);
}
