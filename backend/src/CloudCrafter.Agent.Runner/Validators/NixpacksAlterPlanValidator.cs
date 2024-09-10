using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class NixpacksAlterPlanParamsValidator : AbstractValidator<NixpacksAlterPlanParams> { }

[DeploymentStep(DeploymentBuildStepType.NixpacksAlterPlan)]
public class NixpacksAlterPlanConfig : IDeploymentStepConfig<NixpacksAlterPlanParams>
{
    public IValidator<NixpacksAlterPlanParams> Validator => new NixpacksAlterPlanParamsValidator();
}
