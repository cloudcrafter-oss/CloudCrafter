using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Factories;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public class DeploymentStepFactory(IServiceProvider serviceProvider) : IDeploymentStepFactory
{
    public IDeploymentStep<TParams> CreateHandler<TParams>(DeploymentBuildStepType type)
    {
        var handler = serviceProvider.GetServices<IDeploymentStep>();
        if (handler == null)
        {
            throw new InvalidOperationException(
                $"No handler registered for step type {type} with params type {typeof(TParams).Name}"
            );
        }
        return handler;
    }

    public IDeploymentStepConfig<TParams> GetConfig<TParams>(DeploymentBuildStepType type)
    {
        var config = serviceProvider.GetKeyedService<IDeploymentStepConfig<TParams>>(type);
        if (config == null)
        {
            throw new InvalidOperationException(
                $"No config registered for step type {type} with params type {typeof(TParams).Name}"
            );
        }
        return config;
    }
}
