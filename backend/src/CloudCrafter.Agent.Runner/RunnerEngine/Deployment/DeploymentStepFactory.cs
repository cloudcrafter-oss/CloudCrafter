using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Factories;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public interface IDeploymentStepFactory
{
    IDeploymentStep<TParams> CreateHandler<TParams>(DeploymentBuildStepType type)
        where TParams : BaseParams;
    IDeploymentStep GetHandler(DeploymentBuildStepType type);
    Type GetParamType(DeploymentBuildStepType type);
}

public class DeploymentStepFactory : IDeploymentStepFactory
{
    private readonly IServiceProvider _serviceProvider;

    public DeploymentStepFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Type GetParamType(DeploymentBuildStepType type)
    {
        var handler = GetHandler(type);
        return handler.ParamType;
    }

    public IDeploymentStep GetHandler(DeploymentBuildStepType type)
    {
        var handlers = _serviceProvider.GetServices<IDeploymentStep>();
        var handler = handlers.FirstOrDefault(h => h.Type == type);

        if (handler == null)
        {
            throw new InvalidOperationException($"No handler registered for step type {type}");
        }

        return handler;
    }

    public IDeploymentStep<TParams> CreateHandler<TParams>(DeploymentBuildStepType type)
        where TParams : BaseParams
    {
        var handler = GetHandler(type);

        if (handler is not IDeploymentStep<TParams> typedHandler)
        {
            throw new InvalidOperationException(
                $"Handler for step type {type} does not support parameter type {typeof(TParams).Name}"
            );
        }

        return typedHandler;
    }
}

// Extension method for registering deployment steps
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDeploymentStep<TStep, TParams>(
        this IServiceCollection services
    )
        where TStep : class, IDeploymentStep<TParams>
        where TParams : BaseParams
    {
        services.AddTransient<IDeploymentStep, TStep>();
        return services;
    }
}
