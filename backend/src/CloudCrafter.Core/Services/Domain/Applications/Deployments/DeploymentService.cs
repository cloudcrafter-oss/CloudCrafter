using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Jobs.Dispatcher;

namespace CloudCrafter.Core.Services.Domain.Applications.Deployments;

public class DeploymentService() : IDeploymentService
{
    public Task<Guid> DeployAsync(Guid requestApplicationId)
    {
        var newGuid = Guid.NewGuid();
        return Task.FromResult(newGuid);
    }
}
