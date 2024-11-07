namespace CloudCrafter.Agent.SignalR.Models;

public class ContainerHealthCheckArgs
{
    public required Dictionary<Guid, ContainerHealthCheckStackInfo> Info { get; init; }
}

public class ContainerHealthCheckStackInfo
{
    public required Dictionary<
        Guid,
        ContainerHealthCheckStackInfoHealthStatus
    > StackServices { get; init; }
}

public enum ContainerHealthCheckStackInfoHealthStatus
{
    Unknown,
    Unsupported,
    Degraded,
    Unhealthy,
    Healthy,
}
