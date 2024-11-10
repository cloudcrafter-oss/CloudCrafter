namespace CloudCrafter.Domain.Entities;

public class EntityStackServiceHealthStatus : EntityHealthStatus
{
    public bool IsRunning { get; set; }

    public void SetStatus(EntityHealthStatusValue value, bool isRunning)
    {
        Value = value;
        StatusAt = DateTime.UtcNow;
        IsRunning = isRunning;
    }
}
