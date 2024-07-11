using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Jobs.Service;

namespace CloudCrafter.Core.Services.Domain.Applications.Deployments;

public class DeploymentService(ICloudCrafterDispatcher jobDispatcher) : IDeploymentService
{
    public async Task<Guid> DeployAsync(Guid requestApplicationId)
    {
        var newGuid = Guid.NewGuid();
        await jobDispatcher.DispatchDeploymentAsync(newGuid);

        return newGuid;
    }
}
