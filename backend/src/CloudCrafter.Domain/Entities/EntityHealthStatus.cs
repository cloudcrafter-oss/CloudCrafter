namespace CloudCrafter.Domain.Entities;

public class EntityHealthStatus
{
    public DateTime? StatusAt { get; set; }
    public EntityHealthStatusValue Value { get; set; } = EntityHealthStatusValue.Unknown;

    public void SetStatus(EntityHealthStatusValue value)
    {
        Value = value;
        StatusAt = DateTime.UtcNow;
    }
}

public enum EntityHealthStatusValue
{
    Unknown,
    Unsupported,
    Degraded,
    Unhealthy,
    Healthy,
    HealthCheckOverdue,
}
