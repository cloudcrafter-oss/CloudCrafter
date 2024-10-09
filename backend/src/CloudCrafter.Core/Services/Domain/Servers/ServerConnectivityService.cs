using System.Diagnostics;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Repositories;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Servers;

public class ServerConnectivityService(
    IServerRepository repository,
    IAgentManager agentManager,
    ILogger<ServerConnectivityService> logger
) : IServerConnectivityService
{
    public async Task PerformConnectivityCheckAsync()
    {
        var stopwatch2 = Stopwatch.StartNew();
        await agentManager.SendPingToAgents();

        stopwatch2.Stop();

        var elapsedMs2 = stopwatch2.ElapsedMilliseconds;

        logger.LogCritical("Elapsed time to send ping to agents: {ElapsedMs2}ms", elapsedMs2);
    }

    public Task StoreServerInfo(Guid serverId, HealthCheckCommandArgs data)
    {
        return repository.StoreServerInfo(serverId, data);
    }
}
