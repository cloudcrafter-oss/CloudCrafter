using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public class DeploymentStepFactory(IServiceProvider serviceProvider) : IDeploymentStepFactory
{
    public IDeploymentStepHandler<TParams> CreateHandler<TParams>(DeploymentBuildStepType type)
    {
        return type switch
        {
            DeploymentBuildStepType.FetchGitRepository => serviceProvider
                .GetRequiredService<IDeploymentStepHandler<GitCheckoutParams>>() as IDeploymentStepHandler<TParams>,
            _ => throw new ArgumentException($"Unknown step type: {type}")
        } ?? throw new InvalidOperationException(
            $"Handler for step type {type} is not assignable to IStepHandler<{typeof(TParams).Name}>");
    }

    public IDeploymentStepConfig<TParams> GetConfig<TParams>(DeploymentBuildStepType type)
    {
        return type switch
        {
            DeploymentBuildStepType.FetchGitRepository => serviceProvider
                .GetRequiredService<IDeploymentStepConfig<GitCheckoutParams>>() as IDeploymentStepConfig<TParams>,
            _ => throw new ArgumentException($"Unknown step type: {type}")
        } ?? throw new InvalidOperationException(
            $"Config for step type {type} is not assignable to IStepConfig<{typeof(TParams).Name}>");
    }
}
