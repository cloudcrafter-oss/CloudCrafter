using CloudCrafter.Agent.Runner.SignalR.Providers;
using CloudCrafter.Agent.SignalR.Models;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Core;
using Serilog.Events;

namespace CloudCrafter.Agent.Runner.Logging;

public class ChannelIdEnricher(IServiceProvider serviceProvider) : ILogEventEnricher
{
    private static int SEQUENCE;

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        if (logEvent.Properties.TryGetValue("ChannelId", out var value))
        {
            var propertyValue = value.ToString();

            if (Guid.TryParse(propertyValue, out var channelId))
            {
                var hubWrapper = serviceProvider.GetRequiredService<IHubWrapper>();

                if (hubWrapper.TypedHubConnection.IsConnected())
                {
                    var logMessage = logEvent.RenderMessage();
                    hubWrapper.TypedHubConnection.InvokeAsync(hub =>
                        hub.DeploymentOutput(
                            new DeploymentOutputArgs
                            {
                                ChannelId = channelId,
                                Output = new ChannelOutputLogLine
                                {
                                    Date = logEvent.Timestamp.UtcDateTime,
                                    IsError = logEvent.Level == LogEventLevel.Error,
                                    Output = logMessage,
                                    InternalOrder = SEQUENCE,
                                },
                            }
                        )
                    );
                    SEQUENCE++;
                }
            }
        }
    }
}
