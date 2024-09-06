using CloudCrafter.Domain.Entities.Jobs;
using CloudCrafter.Domain.Interfaces;
using EntityFrameworkCore.EncryptColumn.Attributes;

namespace CloudCrafter.Domain.Entities;

public class BackgroundJob : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required string? HangfireJobId { get; set; }
    public required BackgroundJobType Type { get; init; }

    [EncryptColumn] public string SerializedArguments { get; set; } = string.Empty;

    public ServerConnectivityCheckJob? ServerConnectivityCheckJob { get; set; }
    public Guid? ServerConnectivityCheckJobId { get; set; }
    public List<BackgroundJobLog> Logs { get; set; } = new();
    public required BackgroundJobStatus Status { get; set; }
    public DateTime? CompletedAt { get; set; }
    public long? RunningTime { get; set; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }
}

public enum BackgroundJobType
{
    ServerConnectivityCheck,
    StackDeployment
}

public enum BackgroundJobStatus
{
    Created,
    Enqueued,
    Running,
    Failed,
    Completed
}

public class BackgroundJobLog
{
    public required DateTime Timestamp { get; set; }
    public required string Level { get; set; }
    public required string Message { get; set; }
    public string? Exception { get; set; }
}
