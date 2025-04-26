using AutoMapper;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Core.Services.Core;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.User.ACL;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Applications.Deployments;

public class DeploymentService(
    ICloudCrafterDispatcher dispatcher,
    IStacksService stackService,
    IServerRepository serverRepository,
    IDeploymentRepository deploymentRepository,
    IDistributedLockService lockService,
    ILogger<DeploymentService> logger,
    IUserAccessService userAccessService,
    IUser user,
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
                    Level = log.Level,
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

    public async Task<List<DeploymentLogDto>> GetDeploymentLogs(Guid deploymentId)
    {
        var deployment = await deploymentRepository.GetDeploymentAsync(deploymentId);

        var server = await serverRepository.GetServerEntityOrFail(deployment.ServerId);

        await userAccessService.EnsureHasAccessToEntity(server, user?.Id, AccessType.Read);

        var logs = deployment.Logs.OrderBy(x => x.Date).ToList();

        return mapper.Map<List<DeploymentLogDto>>(logs);
    }
}
