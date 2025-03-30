namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

public class GitCheckoutParams : BaseParams
{
    public string Repo { get; set; } = string.Empty;
    public string Commit { get; set; } = string.Empty;
}
