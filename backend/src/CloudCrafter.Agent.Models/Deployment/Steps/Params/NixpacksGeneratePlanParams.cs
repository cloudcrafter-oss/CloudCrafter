using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

[DeploymentStep(DeploymentBuildStepType.NixpacksGeneratePlan)]
public class NixpacksGeneratePlanParams
{
    public string Path { get; set; } = string.Empty;
}
