using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public abstract class GitProvider : BaseEntity
{
    public required string Name { get; set; }
}
