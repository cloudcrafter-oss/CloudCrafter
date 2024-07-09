namespace CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;

public interface ISshConnectionInfo
{
    string Host { get; }
    int Port { get; }
    string Username { get; }
    string PrivateKeyPath { get; }
}
