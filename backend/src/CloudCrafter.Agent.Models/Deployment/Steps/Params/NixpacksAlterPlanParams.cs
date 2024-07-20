using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

[DeploymentStep(DeploymentBuildStepType.NixpacksAlterPlan)]
// ReSharper disable once ClassNeverInstantiated.Global
public class NixpacksAlterPlanParams
{
    public IEnumerable<string> Packages { get; set; } = new List<string>();
}
