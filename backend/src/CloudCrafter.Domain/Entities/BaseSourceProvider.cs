using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public abstract class BaseSourceProvider : BaseEntity
{
    public required string Name { get; set; }
}
