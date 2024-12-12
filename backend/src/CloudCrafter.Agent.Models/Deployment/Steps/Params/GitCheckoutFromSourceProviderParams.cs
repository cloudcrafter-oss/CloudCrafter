using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

[DeploymentStep(DeploymentBuildStepType.FetchGitRepositoryFromProvider)]
// ReSharper disable once ClassNeverInstantiated.Global
public class GitCheckoutFromSourceProviderParams : BaseParams
{
    public string Repo { get; set; } = string.Empty;
    public string Commit { get; set; } = string.Empty;
}
