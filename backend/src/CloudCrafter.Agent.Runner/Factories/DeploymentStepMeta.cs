using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Factories;

public interface IDeploymentStep
{
    DeploymentBuildStepType Type { get; }
    Type ParamType { get; }
}

public interface IDeploymentStep<TParams> : IDeploymentStep
    where TParams : BaseParams
{
    Task ExecuteAsync(TParams parameters, DeploymentContext context);
    Task DryRun(TParams parameters, DeploymentContext context);
    IValidator<TParams> Validator { get; }
}

public abstract class BaseDeploymentStep<TParams> : IDeploymentStep<TParams>
    where TParams : BaseParams
{
    public abstract DeploymentBuildStepType Type { get; }
    public Type ParamType => typeof(TParams);
    public abstract IValidator<TParams> Validator { get; }
    public abstract Task ExecuteAsync(TParams parameters, DeploymentContext context);
    public abstract Task DryRun(TParams parameters, DeploymentContext context);
}
