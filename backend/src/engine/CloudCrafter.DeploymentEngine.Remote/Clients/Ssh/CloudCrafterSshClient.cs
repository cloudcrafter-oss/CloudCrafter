using CloudCrafter.DeploymentEngine.Domain.Commands;
using CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;
using CloudCrafter.DeploymentEngine.Remote.Exceptions;
using Renci.SshNet;

namespace CloudCrafter.DeploymentEngine.Remote.Clients.Ssh;

public class CloudCrafterSshClient(ISshConnectionInfo connectionInfo) : ICloudCrafterRemoteClient
{
    private SshClient? _client;

    public bool IsConnected => _client?.IsConnected ?? false;

    public void Dispose()
    {
        _client?.Dispose();
    }

    public Task ConnectAsync(CancellationToken cancellationToken = default)
    {
        var privateKey = new PrivateKeyFile(connectionInfo.PrivateKeyPath);
        _client = new SshClient(
            connectionInfo.Host,
            connectionInfo.Port,
            connectionInfo.Username,
            privateKey
        );

        return _client.ConnectAsync(cancellationToken);
    }

    public async Task<ExecutedCommandDetails> ExecuteCommandAsync(
        string command,
        bool ignoreFailure = false
    )
    {
        if (!IsConnected || _client is null)
        {
            throw new InvalidOperationException("Client is not connected");
        }

        using var cmd = _client.CreateCommand(command);

        await cmd.ExecuteAsync();

        if (cmd.ExitStatus != 0 && !ignoreFailure)
        {
            throw new CommandFailedException(
                command,
                cmd.Error.TrimEnd('\n'),
                cmd.Result.TrimEnd('\n'),
                cmd.ExitStatus.GetValueOrDefault(-1)
            );
        }

        // TODO: Move this to a factory
        return new ExecutedCommandDetails
        {
            Command = command,
            Result = cmd.Result.TrimEnd('\n'),
            Error = cmd.Error.TrimEnd('\n'),
            ExitStatus = cmd.ExitStatus,
        };
    }
}
