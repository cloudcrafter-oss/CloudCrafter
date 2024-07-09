using CloudCrafter.DeploymentEngine.Domain.Commands;

namespace CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;

public interface ICloudCrafterRemoteClient : IDisposable
{
    Task ConnectAsync(CancellationToken cancellationToken = default);
    Task<ExecutedCommandDetails> ExecuteCommandAsync(string command);

    bool IsConnected { get; }
}
