using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class NixpacksWritePlanToFileSystemValidator
    : AbstractValidator<NixpacksWritePlanToFileSystemParams> { }

[DeploymentStep(DeploymentBuildStepType.NixpacksWritePlanToFileSystem)]
public class NixpacksWritePlanToFileSystemConfig
    : IDeploymentStepConfig<NixpacksWritePlanToFileSystemParams>
{
    public IValidator<NixpacksWritePlanToFileSystemParams> Validator =>
        new NixpacksWritePlanToFileSystemValidator();
}
