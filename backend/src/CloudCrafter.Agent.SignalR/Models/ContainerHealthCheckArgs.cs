namespace CloudCrafter.Agent.SignalR.Models;

public class ContainerHealthCheckArgs
{
    public required Dictionary<Guid, ContainerHealthCheckStackInfo> Info { get; init; }
}

public class ContainerHealthCheckStackInfo
{
    public required Dictionary<Guid, ContainerHealthOptions> StackServices { get; init; }
}

public class ContainerHealthOptions
{
    public required ContainerHealthCheckStackInfoHealthStatus Status { get; init; }
    public required bool IsRunning { get; init; }
}

public enum ContainerHealthCheckStackInfoHealthStatus
{
    Unknown,
    Unsupported,
    Degraded,
    Unhealthy,
    Healthy,
}
