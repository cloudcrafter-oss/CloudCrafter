using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class NixpacksGeneratePlanParamsValidator : AbstractValidator<NixpacksGeneratePlanParams>
{
    public NixpacksGeneratePlanParamsValidator()
    {
        RuleFor(x => x.Path).NotEmpty();
    }
}

[DeploymentStep(DeploymentBuildStepType.NixpacksGeneratePlan)]
public class NixpacksGeneratePlanConfig : IDeploymentStepConfig<NixpacksGeneratePlanParams>
{
    public IValidator<NixpacksGeneratePlanParams> Validator =>
        new NixpacksGeneratePlanParamsValidator();
}
