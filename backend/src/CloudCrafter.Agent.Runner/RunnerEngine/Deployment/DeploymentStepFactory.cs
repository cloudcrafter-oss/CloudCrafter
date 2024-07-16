using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Recipe;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public class DeploymentStepFactory(IServiceProvider serviceProvider) : IDeploymentStepFactory
{
    public IDeploymentStep CreateStep(DeploymentBuildStepType stepType)
    {
        return stepType switch
        {
            DeploymentBuildStepType.FetchGitRepository => serviceProvider.GetRequiredKeyedService<IDeploymentStep>(
                DeploymentBuildStepType.FetchGitRepository),
            _ => throw new ArgumentOutOfRangeException(nameof(stepType), stepType, null)
        };
    }
}
