using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;

[DeploymentStep(DeploymentBuildStepType.DockerComposeUp)]
// ReSharper disable once ClassNeverInstantiated.Global
public class DockerComposeUpParams : BaseParams
{
    public string DockerComposeFile { get; init; } = string.Empty;
    public bool? StoreServiceNames { get; init; }
}
