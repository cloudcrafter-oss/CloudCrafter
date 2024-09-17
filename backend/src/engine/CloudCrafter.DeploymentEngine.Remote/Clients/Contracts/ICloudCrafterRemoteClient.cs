using CloudCrafter.DeploymentEngine.Domain.Commands;

namespace CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;

public interface ICloudCrafterRemoteClient : IDisposable
{
    bool IsConnected { get; }
    Task ConnectAsync(CancellationToken cancellationToken = default);
    Task<ExecutedCommandDetails> ExecuteCommandAsync(string command, bool ignoreFailure = false);
}
