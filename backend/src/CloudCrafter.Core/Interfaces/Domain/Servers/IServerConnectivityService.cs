using CloudCrafter.DeploymentEngine.Remote.Manager;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Domain.Servers;

public interface IServerConnectivityService
{
    Task PerformConnectivityCheckAsync(Guid serverId);

    CloudCrafterEngineManager CreateEngineManager(Server server);
}
