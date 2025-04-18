using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public class Team : BaseAuditableEntity
{
    public required string Name { get; set; }
}
