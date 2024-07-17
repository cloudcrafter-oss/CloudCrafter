using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;

namespace CloudCrafter.Agent.Models.Deployment;

public interface IDeploymentStepHandler<TParams>
{
    Task ExecuteAsync(TParams paramseters, DeploymentContext context);
}
