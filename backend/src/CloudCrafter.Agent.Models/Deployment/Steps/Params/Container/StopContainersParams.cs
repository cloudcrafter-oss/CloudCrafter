namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;

public class StopContainersParams : BaseParams
{
    public Dictionary<string, List<string>> Filters { get; init; } = new();
    public bool? OnlyCloudCrafterContainers { get; init; }
}
