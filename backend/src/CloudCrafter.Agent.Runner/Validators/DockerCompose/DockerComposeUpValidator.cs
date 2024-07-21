using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators.DockerCompose;

public class DockerComposeUpValidator : AbstractValidator<DockerComposeUpParams>
{
    public DockerComposeUpValidator()
    {
        RuleFor(x => x.DockerComposeFile).NotEmpty();
    }
}

[DeploymentStep(DeploymentBuildStepType.DockerComposeUp)]
public class DockerComposeUpConfig : IDeploymentStepConfig<DockerComposeUpParams>
{
    public IValidator<DockerComposeUpParams> Validator => new DockerComposeUpValidator();
}
