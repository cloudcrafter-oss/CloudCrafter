using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;


[DeploymentStep(DeploymentBuildStepType.DockerComposeWriteToFileSystem)]
// ReSharper disable once ClassNeverInstantiated.Global
public class DockerComposeWriteToFileSystemParams
{
    public string Directory { get; init; } = string.Empty;
}
