using Serilog.Context;

namespace CloudCrafter.Agent.Runner.Logging;

public class AgentLoggingChannelScope(Guid channelId) : IDisposable
{
    private readonly IDisposable _disposable = LogContext.PushProperty("ChannelId", channelId);

    public void Dispose()
    {
        _disposable?.Dispose();
    }
}
