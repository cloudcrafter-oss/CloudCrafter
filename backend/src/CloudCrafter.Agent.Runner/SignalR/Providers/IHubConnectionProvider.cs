using Microsoft.AspNetCore.SignalR.Client;

namespace CloudCrafter.Agent.Runner.SignalR.Providers;

public interface IHubConnectionProvider
{
    HubConnection CreateConnection(string host, Guid agentId, string agentKey);
}
