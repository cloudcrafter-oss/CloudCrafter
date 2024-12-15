using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

public class GitCheckoutFromSourceProviderParams : BaseParams
{
    public string Repo { get; set; } = string.Empty;
    public string Commit { get; set; } = string.Empty;
}
