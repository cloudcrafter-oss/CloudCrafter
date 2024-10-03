using Microsoft.AspNetCore.SignalR.Client;

namespace CloudCrafter.Agent.Runner.SignalR.Providers;

public class HubConnectionProvider : IHubConnectionProvider
{
    public HubConnection CreateConnection(string host, Guid agentId, string agentKey)
    {
        return new HubConnectionBuilder()
            .WithUrl($"{host}/hub/agent?agentId={agentId}&agentKey={agentKey}")
            .WithAutomaticReconnect()
            .Build();
    }
}
