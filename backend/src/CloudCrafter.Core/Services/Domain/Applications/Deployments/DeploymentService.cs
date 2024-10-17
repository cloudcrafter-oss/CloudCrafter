using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Services.Domain.Applications.Deployments;

public class DeploymentService(
    ICloudCrafterDispatcher dispatcher,
    IStacksService stackService,
    IDeploymentRepository deploymentRepository
) : IDeploymentService
{
    public async Task<Guid> DeployAsync(Guid stackId)
    {
        var deploymentId = await stackService.CreateDeployment(stackId);

        await dispatcher.EnqueueStackDeployment(deploymentId);

        return deploymentId;
    }

    public async Task StoreDeploymentLogAsync(Guid deploymentId, ChannelOutputLogLine log)
    {
        var deployment = await deploymentRepository.GetDeploymentAsync(deploymentId);

        deployment.Logs.Add(
            new DeploymentLog()
            {
                Log = log.Output,
                IsError = log.IsError,
                Date = log.Date,
            }
        );

        await deploymentRepository.SaveChangesAsync();
    }
}
