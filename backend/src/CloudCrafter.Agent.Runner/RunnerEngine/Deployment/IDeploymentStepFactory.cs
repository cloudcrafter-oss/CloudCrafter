using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public interface IDeploymentStepFactory
{
    IDeploymentStepHandler<TParams> CreateHandler<TParams>(DeploymentBuildStepType type);
    IDeploymentStepConfig<TParams> GetConfig<TParams>(DeploymentBuildStepType type);
}
