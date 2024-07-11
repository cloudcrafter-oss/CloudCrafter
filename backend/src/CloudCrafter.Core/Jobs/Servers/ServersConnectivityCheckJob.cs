using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Core.Jobs.Servers.SingleServer;
using Hangfire.Console;
using Hangfire.Server;

namespace CloudCrafter.Core.Jobs.Servers;

public class ServersConnectivityCheckJob(IServersService service, ICloudCrafterDispatcher dispatcher)
{
    public async Task RunAsync(PerformContext? context)
    {
        var servers = await service.GetServers();
        context?.WriteLine($"Fetched {servers.Count} servers");

        foreach (var server in servers)
        {
            var arg = new ServerConnectivityCheckJob.Args(server.Id);

            await dispatcher.DispatchServerConnectivityCheck(arg);
        }
        
        context?.WriteLine("Dispatched all servers for connectivity checks");
        
    }
}
