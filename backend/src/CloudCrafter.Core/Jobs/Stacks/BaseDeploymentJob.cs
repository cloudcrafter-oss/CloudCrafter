using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Jobs.Stacks;

public abstract class BaseDeploymentJob
{
    protected CloudCrafterEngineManager GetEngineManager(
        IServerConnectivityService connectivityService,
        Server server
    )
    {
        return connectivityService.CreateEngineManager(server);
    }
}
