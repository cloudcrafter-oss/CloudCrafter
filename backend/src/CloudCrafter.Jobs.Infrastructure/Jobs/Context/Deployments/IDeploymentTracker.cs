using Hangfire.Server;

namespace CloudCrafter.Jobs.Infrastructure.Jobs.Context.Deployments;

public interface IDeploymentTracker
{
    void SetDeploymentContext(PerformContext context);
    PerformContext? GetContext();
    
    Guid GetDeploymentId();
    void SetDeploymentId(Guid id);
}
