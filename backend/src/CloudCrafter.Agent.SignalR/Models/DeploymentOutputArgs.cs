namespace CloudCrafter.Agent.SignalR.Models;

public class DeploymentOutputArgs
{
    public required Guid ChannelId { get; init; }
    public required ChannelOutputLogLine Output { get; init; }
}

public class ChannelOutputLogLine
{
    public required string Output { get; init; }
    public required bool IsError { get; init; }
    public required DateTime Date { get; init; }

    // TODO: Enrich stderr/stdout
    public required int InternalOrder { get; init; }
}
