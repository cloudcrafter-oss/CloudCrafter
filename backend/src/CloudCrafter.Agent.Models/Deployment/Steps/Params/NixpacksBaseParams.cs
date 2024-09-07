namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

public abstract class NixpacksBaseParams : BaseParams
{
    public string Path { get; set; } = string.Empty;
}
