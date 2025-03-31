using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public class StackServiceVolume : BaseAuditableEntity
{
    public StackService StackService { get; set; } = null!;
    public required Guid StackServiceId { get; set; }

    public required string Name { get; set; } // e.g., db-data
    public required string? SourcePath { get; set; } // only when Type == LocalMount
    public required string DestinationPath { get; set; } // e.g., /var/lib/postgresql/data
    public required StackServiceVolumeType Type { get; set; }
}
