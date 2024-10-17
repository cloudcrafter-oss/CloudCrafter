using CloudCrafter.Agent.SignalR.Models;

namespace CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;

public interface IDeploymentService
{
    Task<Guid> DeployAsync(Guid requestApplicationId);

    Task StoreDeploymentLogAsync(Guid deploymentId, ChannelOutputLogLine log);
}
