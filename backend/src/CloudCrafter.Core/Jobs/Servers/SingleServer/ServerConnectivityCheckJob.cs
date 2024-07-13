using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.DeploymentEngine.Domain.Models;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using Hangfire.Console;
using Hangfire.Server;

namespace CloudCrafter.Core.Jobs.Servers.SingleServer;

public class ServerConnectivityCheckJob(IServersService serverService, ICloudCrafterEngineManagerFactory managerFactory)
{
    public record Args(Guid ServerId);

    public async Task RunAsync(PerformContext? context, Args args)
    {
        try
        {
            EngineServerModel engineServerModel =
                await serverService.GetDeploymentEngineModelForServerAsync(args.ServerId);

            var manager = managerFactory.CreateFromModel(engineServerModel);

            var client = manager.CreateSshClient();

            await client.ConnectAsync();
        }
        catch (Exception ex)
        {
            context?.WriteLine("Failed to connect to server");
            context?.WriteLine($"Caught exception: {ex.Message}");
            context?.WriteLine(ex.StackTrace);
        }

    }
}
