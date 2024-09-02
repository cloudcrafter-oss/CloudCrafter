namespace CloudCrafter.Domain.Common;

public abstract class BaseAuditableEntity : BaseEntity
{
    public Guid? CreatedBy { get; set; }
    public Guid? LastModifiedBy { get; set; }
}
