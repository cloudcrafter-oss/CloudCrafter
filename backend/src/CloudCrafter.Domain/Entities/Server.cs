using CloudCrafter.Domain.Interfaces;
using EntityFrameworkCore.EncryptColumn.Attributes;

namespace CloudCrafter.Domain.Entities;

public class Server : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string IpAddress { get; set; }

    [EncryptColumn]
    public string? AgentSecretKey { get; set; }

    /// <summary>
    ///     This is the data directory. When mounting the Agent container on this server,
    ///     this is the data directory that will be mounted into the container.
    ///     This may be a docker volume name or an absolute path.
    ///     When running on Mac or Windows, this most likely needs to be a docker volume.
    ///     We're using Docker in Docker, so the test-container uses the docker socket of the host.
    ///     So, when using a path, it needs to be a path that is accessible from the host.
    /// </summary>
    public string DockerDataDirectoryMount { get; set; } = string.Empty;

    // TODO: Remove this property
    public required int SshPort { get; set; } = 22;

    public ServerPingData PingHealthData { get; set; } = new();

    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }

    public ICollection<Stack> Stacks { get; set; } = [];
}
