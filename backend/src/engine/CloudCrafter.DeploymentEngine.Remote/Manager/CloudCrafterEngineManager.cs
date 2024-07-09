using CloudCrafter.DeploymentEngine.Domain.Models;
using CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;
using CloudCrafter.DeploymentEngine.Remote.Clients.Ssh;
using Renci.SshNet;

namespace CloudCrafter.DeploymentEngine.Remote.Manager;

public class CloudCrafterEngineManager(EngineServerModel serverModel)
{
    public ICloudCrafterRemoteClient CreateSshClient()
    {
        var tempKeyPath = CreateTemporarySshKeyFile(serverModel.SshKey);

        var connectionInfo = new SshConnectionInfo(serverModel.Host, serverModel.Port, serverModel.Username, tempKeyPath);

        return new CloudCrafterSshClient(connectionInfo);
    }
    
    private string CreateTemporarySshKeyFile(string sshKey)
    {
        var tempKeyPath = Path.GetTempFileName();
        File.WriteAllText(tempKeyPath, sshKey);
        return tempKeyPath;
    }
}
