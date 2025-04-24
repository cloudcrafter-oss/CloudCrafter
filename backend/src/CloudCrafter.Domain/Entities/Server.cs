using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Entities.Interfaces;
using EntityFrameworkCore.EncryptColumn.Attributes;

namespace CloudCrafter.Domain.Entities;

public class Server : BaseAuditableEntity, IMayHaveATeam
{
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

    public required string DockerNetwork { get; set; } = "cloudcrafter";

    // TODO: Remove this property
    public required int SshPort { get; set; } = 22;

    public ServerPingData PingHealthData { get; set; } = new();

    public ICollection<Stack> Stacks { get; set; } = [];

    public required Guid? TeamId { get; set; }
    public Team? Team { get; set; }

    public void UpdateServerAgentKey(string key)
    {
        AgentSecretKey = key;
    }
}
