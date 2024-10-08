using CloudCrafter.Agent.Runner.SignalR;
using CloudCrafter.Agent.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using Serilog.Core;
using Serilog.Events;

namespace CloudCrafter.Agent.Runner.Logging;

public class SignalRSink(IFormatProvider? formatProvider = null) : ILogEventSink
{
    public void Emit(LogEvent logEvent)
    {
        var message = logEvent.RenderMessage(formatProvider);

        // hubConnection.InvokeAsync(hub =>
        //     hub.DeploymentOutput(
        //         new DeploymentOutputArgs { Output = message, ChannelId = channelId }
        //     )
        // );
    }
}
