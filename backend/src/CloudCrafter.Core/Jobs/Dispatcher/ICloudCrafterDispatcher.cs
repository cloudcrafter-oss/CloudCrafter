using CloudCrafter.Core.Jobs.Servers.SingleServer;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public interface ICloudCrafterDispatcher
{
    Task DispatchDeploymentAsync(Guid deploymentId);
    Task DispatchServerConnectivityChecks();
    Task DispatchServerConnectivityCheck(ServerConnectivityCheckJob.Args args);
}
