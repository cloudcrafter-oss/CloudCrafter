using CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;

namespace CloudCrafter.DeploymentEngine.Remote.Clients.Ssh;

public class SshConnectionInfo(string host, int port, string username, string privateKeyPath)
    : ISshConnectionInfo
{
    public string Host { get; } = host;
    public int Port { get; } = port;
    public string Username { get; } = username;
    public string PrivateKeyPath { get; } = privateKeyPath;

}
