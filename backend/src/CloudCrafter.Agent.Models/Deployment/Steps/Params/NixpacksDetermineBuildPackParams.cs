using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

[DeploymentStep(DeploymentBuildStepType.NixpacksDetermineBuildPack)]
public class NixpacksDetermineBuildPackParams
{
    public string Path { get; set; } = string.Empty;
}
