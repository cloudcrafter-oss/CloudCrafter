using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Core.Jobs.Servers.SingleServer;
using Hangfire;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public class CloudCrafterDispatcher : ICloudCrafterDispatcher
{
    public Task DispatchDeploymentAsync(Guid deploymentId)
    {
        throw new NotImplementedException();
    }

    public Task DispatchServerConnectivityChecks()
    {
        BackgroundJob.Enqueue<ServersConnectivityCheckJob>(job => job.RunAsync(null));

        return Task.CompletedTask;
    }

    public Task DispatchServerConnectivityCheck(ServerConnectivityCheckJob.Args args)
    {
        BackgroundJob.Enqueue<ServerConnectivityCheckJob>(job => job.RunAsync(null, args));

        return Task.CompletedTask;
    }
}
