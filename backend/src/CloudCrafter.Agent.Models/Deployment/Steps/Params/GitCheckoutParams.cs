using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

[DeploymentStep(DeploymentBuildStepType.FetchGitRepository)]
// ReSharper disable once ClassNeverInstantiated.Global
public class GitCheckoutParams
{
    public string Repo { get; set; } = string.Empty;
    public string Commit { get; set; } = string.Empty;
}
