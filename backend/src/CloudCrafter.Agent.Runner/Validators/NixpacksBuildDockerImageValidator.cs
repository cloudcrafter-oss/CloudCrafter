using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Agent.Runner.Validators;

public class NixpacksBuildDockerImageValidator : AbstractValidator<NixpacksBuildDockerImageParams>
{
    public NixpacksBuildDockerImageValidator()
    {
        RuleFor(x => x.Path).NotEmpty();
        RuleFor(x => x.Image).NotEmpty();
        RuleFor(x => x.Tag).NotEmpty();
    }
}

[DeploymentStep(DeploymentBuildStepType.NixpacksBuildDockerImage)]
public class NixpacksBuildDockerImageConfig: IDeploymentStepConfig<NixpacksBuildDockerImageParams>
{
    public IValidator<NixpacksBuildDockerImageParams> Validator => new NixpacksBuildDockerImageValidator();
}
