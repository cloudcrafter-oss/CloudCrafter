namespace CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;

public interface IDeploymentService
{
    Task<Guid> DeployAsync(Guid requestApplicationId);
}
