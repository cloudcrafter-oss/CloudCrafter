using CloudCrafter.Domain.Interfaces;
using EntityFrameworkCore.EncryptColumn.Attributes;

namespace CloudCrafter.Domain.Entities;

public class Server : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string IpAddress { get; set; }

    [EncryptColumn]
    public string? SshUsername { get; set; }

    [EncryptColumn]
    public string? SshPrivateKey { get; set; }

    public required int SshPort { get; set; } = 22;

    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }
}
