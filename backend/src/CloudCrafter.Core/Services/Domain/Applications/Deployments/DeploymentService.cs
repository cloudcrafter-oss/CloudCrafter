using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Jobs.Dispatcher;

namespace CloudCrafter.Core.Services.Domain.Applications.Deployments;

public class DeploymentService(ICloudCrafterDispatcher dispatcher, IStacksService stackService)
    : IDeploymentService
{
    public async Task<Guid> DeployAsync(Guid stackId)
    {
        var deploymentId = await stackService.CreateDeployment(stackId);

        await dispatcher.EnqueueStackDeployment(deploymentId);

        return deploymentId;
    }
}
