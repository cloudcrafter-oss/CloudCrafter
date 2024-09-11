using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.DeploymentEngine.Domain.Models;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Services.Domain.Servers;

public class ServerConnectivityService(
    IServerRepository repository,
    ICloudCrafterEngineManagerFactory engineManagerFactory
) : IServerConnectivityService
{
    private EngineServerModel GetDeploymentEngineModelForServer(Server server)
    {
        if (string.IsNullOrEmpty(server.SshUsername) || string.IsNullOrEmpty(server.SshPrivateKey))
        {
            throw new ArgumentException("Server SSH username or private key is not set");
        }

        EngineServerModel engineModel =
            new()
            {
                Host = server.IpAddress,
                Username = server.SshUsername,
                Port = server.SshPort,
                SshKey = server.SshPrivateKey,
            };

        return engineModel;
    }

    public async Task PerformConnectivityCheckAsync(Guid serverId)
    {
        var server = await repository.GetServerEntityOrFail(serverId);
        var engineModel = GetDeploymentEngineModelForServer(server);

        var engineManager = engineManagerFactory.CreateFromModel(engineModel);

        var client = engineManager.CreateSshClient();

        await client.ConnectAsync();

        var result = await client.ExecuteCommandAsync("ls -la");
    }
}
