using CloudCrafter.Agent.Runner.SignalR;
using CloudCrafter.Agent.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using Serilog.Core;
using Serilog.Events;

namespace CloudCrafter.Agent.Runner.Logging;

public class SignalRSink(
    TypedHubConnection<IAgentHub> hubConnection,
    IFormatProvider? formatProvider = null
) : ILogEventSink
{
    public void Emit(LogEvent logEvent)
    {
        var message = logEvent.RenderMessage(formatProvider);
        var deploymentId = logEvent.Properties.TryGetValue("ChannelId", out var property)
            ? property.ToString()
            : null;

        if (Guid.TryParse(deploymentId, out var channelId))
        {
            hubConnection.InvokeAsync(hub =>
                hub.DeploymentOutput(
                    new DeploymentOutputArgs { Output = message, ChannelId = channelId }
                )
            );
        }
    }
}
