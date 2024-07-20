using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators.DockerCompose;

public class DockerComposeWriteToFileSystemValidator : AbstractValidator<DockerComposeWriteToFileSystemParams>
{
    public DockerComposeWriteToFileSystemValidator()
    {
        RuleFor(x => x.Directory).NotEmpty();
    }
}

[DeploymentStep(DeploymentBuildStepType.DockerComposeWriteToFileSystem)]
public class DockerComposeWriteToFileSystemConfig: IDeploymentStepConfig<DockerComposeWriteToFileSystemParams>
{
    public IValidator<DockerComposeWriteToFileSystemParams> Validator => new DockerComposeWriteToFileSystemValidator();
}
