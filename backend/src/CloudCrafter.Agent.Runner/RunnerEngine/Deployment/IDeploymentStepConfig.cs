using FluentValidation;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public interface IDeploymentStepConfig<TParams>
{
    IValidator<TParams> Validator { get; }
}
