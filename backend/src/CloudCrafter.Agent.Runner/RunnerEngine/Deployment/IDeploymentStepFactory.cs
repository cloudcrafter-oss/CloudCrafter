using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public interface IDeploymentStepFactory
{
    IDeploymentStep CreateStep(DeploymentBuildStepType stepType);
}
