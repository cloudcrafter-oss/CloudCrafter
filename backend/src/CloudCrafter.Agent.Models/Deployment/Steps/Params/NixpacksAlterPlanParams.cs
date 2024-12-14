namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

public class NixpacksAlterPlanParams : BaseParams
{
    public IEnumerable<string> Packages { get; set; } = new List<string>();
}
