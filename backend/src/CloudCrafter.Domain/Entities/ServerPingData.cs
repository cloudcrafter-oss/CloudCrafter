namespace CloudCrafter.Domain.Entities;

public class ServerPingData
{
    public DateTime? LastPingAt { get; set; }
    public string? OsInfo { get; set; }
    public string? DockerVersion { get; set; }

    public double? CpuUsagePercentage { get; set; }
    public int? TotalCpuCount { get; set; }
    public double? MemoryUsagePercentage { get; set; }
    public long? TotalMemoryBytes { get; set; }

    public ServerStatusValue Status { get; set; } = ServerStatusValue.Unknown;

    public void SetStatus(ServerStatusValue status)
    {
        Status = status;
    }
}

public enum ServerStatusValue
{
    Unknown,
    Connected,
    Disconnected,
}
