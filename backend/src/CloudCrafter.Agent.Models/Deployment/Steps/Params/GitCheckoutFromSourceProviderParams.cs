namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

public class GitCheckoutFromSourceProviderParams : BaseParams
{
    public string FullPathWithToken { get; set; } = string.Empty;
    public string ProviderPath { get; set; } = string.Empty;
}
