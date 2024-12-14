using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Factories;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public interface IDeploymentStepFactory
{
    IDeploymentStep<TParams> CreateHandler<TParams>(DeploymentBuildStepType type);
    IDeploymentStepConfig<TParams> GetConfig<TParams>(DeploymentBuildStepType type);
}
