namespace CloudCrafter.Domain.Entities;

public class EntityHealthStatus
{
    public DateTime? StatusAt { get; set; }
    public EntityHealthStatusValue Value { get; set; } = EntityHealthStatusValue.Unknown;
}

public enum EntityHealthStatusValue
{
    Unknown,
    Unsupported,
    Degraded,
    Unhealthy,
    Healthy
}
