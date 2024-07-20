﻿using CloudCrafter.Core.Jobs.Dispatcher.Factory;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public class CloudCrafterDispatcher(BackgroundJobFactory jobFactory) : ICloudCrafterDispatcher
{
    public async Task<string> EnqueueConnectivityCheck(Server server)
    {
        return await jobFactory.CreateAndEnqueueJobAsync<ConnectivityCheckBackgroundJob, Server>(server);
    }

    public async Task EnqueueConnectivityCheck(List<Server> servers)
    {
        foreach (var server in servers)
        {
            await EnqueueConnectivityCheck(server);
        }
    }
}