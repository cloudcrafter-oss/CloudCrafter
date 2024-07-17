namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

public class GitCheckoutParams
{
    public string Repo { get; set; } = string.Empty;
    public string Branch { get; set; } = string.Empty;
}
