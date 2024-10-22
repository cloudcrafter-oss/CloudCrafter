using AutoMapper;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Core.Services.Core;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Applications.Deployments;

public class DeploymentService(
    ICloudCrafterDispatcher dispatcher,
    IStacksService stackService,
    IDeploymentRepository deploymentRepository,
    IDistributedLockService lockService,
    ILogger<DeploymentService> logger,
    IMapper mapper
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
        using var lockObject = await lockService.AcquireLockAsync(
            $"deployment-{deploymentId}",
            TimeSpan.FromMinutes(1),
            TimeSpan.FromMinutes(1)
        );

        if (lockObject != null)
        {
            var deployment = await deploymentRepository.GetDeploymentAsync(deploymentId);

            deployment.Logs.Add(
                new DeploymentLog
                {
                    Log = log.Output,
                    IsError = log.IsError,
                    Date = log.Date,
                    Index = log.InternalOrder,
                }
            );

            await deploymentRepository.SaveChangesAsync();
        }
        else
        {
            logger.LogCritical(
                "Failed to acquire lock for deployment {DeploymentId}",
                deploymentId
            );
        }
    }

    public Task MarkDeployment(Guid deploymentId, DeploymentStatusDto status)
    {
        var statusEntity = mapper.Map<DeploymentState>(status);

        return deploymentRepository.MarkDeployment(deploymentId, statusEntity);
    }
}
