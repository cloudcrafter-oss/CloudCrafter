namespace CloudCrafter.Agent.SignalR.Models;

public class HealthCheckCommandArgs
{
    public required DateTime Timestamp { get; set; }
    public required HostInfo HostInfo { get; set; }
}

public class HostInfo
{
    public required string OsInfo { get; set; }
    public required string DockerVersion { get; set; }
    public required SystemInfo SystemInfo { get; init; }
}

public class SystemInfo
{
    public double CpuUsagePercentage { get; set; }
    public int TotalCpuCount { get; set; }
    public double MemoryUsagePercentage { get; set; }
    public long TotalMemoryBytes { get; set; }
}
