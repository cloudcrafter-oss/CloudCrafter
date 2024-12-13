using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

[DeploymentStep(DeploymentBuildStepType.FetchGitRepository)]
public class GitCheckoutParams : BaseParams
{
    public string Repo { get; set; } = string.Empty;
    public string Commit { get; set; } = string.Empty;
}
