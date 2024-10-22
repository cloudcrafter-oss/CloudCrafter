using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Domain.Domain.Deployment;

namespace CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;

public interface IDeploymentService
{
    Task<Guid> DeployAsync(Guid requestApplicationId);

    Task StoreDeploymentLogAsync(Guid deploymentId, ChannelOutputLogLine log);
    Task MarkDeployment(Guid deploymentId, DeploymentStatusDto status);
}
