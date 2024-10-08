using CloudCrafter.Agent.Runner.SignalR.Providers;
using CloudCrafter.Agent.SignalR.Models;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Core;
using Serilog.Events;

namespace CloudCrafter.Agent.Runner.Logging;

public class ChannelIdEnricher(IServiceProvider serviceProvider) : ILogEventEnricher
{
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
                    var logMessage = logEvent.RenderMessage(null);
                    hubWrapper.TypedHubConnection.InvokeAsync(hub =>
                        hub.DeploymentOutput(
                            new DeploymentOutputArgs()
                            {
                                ChannelId = channelId,
                                Output = logMessage,
                            }
                        )
                    );
                }
            }
        }
    }
}
