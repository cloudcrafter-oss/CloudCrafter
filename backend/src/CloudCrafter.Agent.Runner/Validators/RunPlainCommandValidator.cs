using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class RunPlainCommandValidator : AbstractValidator<RunPlainCommandParams>
{
    public RunPlainCommandValidator()
    {
        RuleFor(x => x.Command).NotEmpty().WithMessage("Provide a command.");
    }
}

[DeploymentStep(DeploymentBuildStepType.RunPlainCommand)]
public class RunPlainCommandConfig : IDeploymentStepConfig<RunPlainCommandParams>
{
    public IValidator<RunPlainCommandParams> Validator => new RunPlainCommandValidator();
}
