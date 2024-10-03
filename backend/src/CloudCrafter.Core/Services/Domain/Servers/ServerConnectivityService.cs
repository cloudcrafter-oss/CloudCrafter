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
    public async Task PerformConnectivityCheckAsync(Guid serverId)
    {
        var stopwatch = Stopwatch.StartNew();
        await repository.GetServerEntityOrFail(serverId);
        stopwatch.Stop();

        var elapsedMs = stopwatch.ElapsedMilliseconds;
        logger.LogCritical("Elapsed time to get server entity: {ElapsedMs}ms", elapsedMs);
        var stopwatch2 = Stopwatch.StartNew();
        await agentManager.SendPingToAgent(serverId);

        stopwatch2.Stop();

        var elapsedMs2 = stopwatch2.ElapsedMilliseconds;

        logger.LogCritical("Elapsed time to send ping to agent: {ElapsedMs2}ms", elapsedMs2);
    }

    public Task StoreServerInfo(Guid serverId, HealthCheckCommandArgs data)
    {
        return repository.StoreServerInfo(serverId, data);
    }
}
