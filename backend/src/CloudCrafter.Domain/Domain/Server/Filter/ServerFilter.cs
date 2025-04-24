namespace CloudCrafter.Domain.Domain.Server.Filter;

public class ServerFilter
{
    public TimeSpan? HealthCheckAgeOlderThan { get; set; }
    public Guid? UserId { get; set; }
}
