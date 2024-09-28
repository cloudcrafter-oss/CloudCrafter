using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Repositories;

namespace CloudCrafter.Core.Services.Domain.Servers;

public class ServerConnectivityService(IServerRepository repository, IAgentManager agentManager)
    : IServerConnectivityService
{
    public async Task PerformConnectivityCheckAsync(Guid serverId)
    {
        await repository.GetServerEntityOrFail(serverId);

        await agentManager.SendPingToAgent(serverId);
    }
}
