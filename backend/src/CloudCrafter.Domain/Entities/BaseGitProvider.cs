using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public abstract class BaseGitProvider : BaseEntity
{
    public required string Name { get; set; }
}
