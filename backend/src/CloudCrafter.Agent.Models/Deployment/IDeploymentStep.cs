using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;

namespace CloudCrafter.Agent.Models.Deployment;

public interface IDeploymentStep
{
    Task ExecuteAsync(DeploymentBuildStep step, DeploymentContext context);
}
