using CloudCrafter.Agent.Runner.SignalR.Providers;
using CloudCrafter.Agent.SignalR.Models;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Core;
using Serilog.Events;

namespace CloudCrafter.Agent.Runner.Logging;

public class ChannelIdEnricher(IServiceProvider serviceProvider) : ILogEventEnricher
{
    private static int _sequence;

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        if (!logEvent.Properties.TryGetValue("ChannelId", out var value))
        {
            return;
        }

        var propertyValue = value.ToString();

        if (!Guid.TryParse(propertyValue, out var channelId))
        {
            return;
        }

        var hubWrapper = serviceProvider.GetRequiredService<IHubWrapper>();

        if (!hubWrapper.TypedHubConnection.IsConnected())
        {
            return;
        }

        var logMessage = logEvent.RenderMessage();

        ChannelOutputLogLineLevel level = logEvent.Level switch
        {
            LogEventLevel.Debug => ChannelOutputLogLineLevel.Debug,
            LogEventLevel.Information => ChannelOutputLogLineLevel.Information,
            LogEventLevel.Warning => ChannelOutputLogLineLevel.Warning,
            LogEventLevel.Error => ChannelOutputLogLineLevel.Error,
            LogEventLevel.Fatal => ChannelOutputLogLineLevel.Fatal,
            _ => ChannelOutputLogLineLevel.Information,
        };
        hubWrapper.TypedHubConnection.InvokeAsync(hub =>
            hub.DeploymentOutput(
                new DeploymentOutputArgs
                {
                    ChannelId = channelId,
                    Output = new ChannelOutputLogLine
                    {
                        Date = logEvent.Timestamp.UtcDateTime,
                        Level = level,
                        Output = logMessage,
                        InternalOrder = _sequence,
                    },
                }
            )
        );
        _sequence++;
    }
}
