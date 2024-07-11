using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.DeploymentEngine.Domain.Models;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using Hangfire.Server;

namespace CloudCrafter.Core.Jobs.Servers.SingleServer;

public class ServerConnectivityCheckJob(IServersService serverService, ICloudCrafterEngineManagerFactory managerFactory)
{
    public record Args(Guid ServerId);

    public async Task RunAsync(PerformContext? context, Args args)
    {
        EngineServerModel engineServerModel = await serverService.GetDeploymentEngineModelForServerAsync(args.ServerId);

        var manager = managerFactory.CreateFromModel(engineServerModel);

        var client = manager.CreateSshClient();

        await client.ConnectAsync();
        
    }
}
