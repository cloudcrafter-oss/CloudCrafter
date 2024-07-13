using CloudCrafter.Core.Jobs.Dispatcher.Factory;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public class CloudCrafterDispatcher(BackgroundJobFactory jobFactory) : ICloudCrafterDispatcher
{
    public async Task EnqueueConnectivityCheck(Server server)
    {
        await jobFactory.CreateAndEnqueueJobAsync<ConnectivityCheckBackgroundJob, Server>(server);
    }
}
