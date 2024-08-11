using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;

[DeploymentStep(DeploymentBuildStepType.StopContainers)]
// ReSharper disable once ClassNeverInstantiated.Global
public class StopContainersParams
{
    public Dictionary<string, List<string>> Filters { get; init; } = new();
    public bool? OnlyCloudCrafterContainers { get; init; }
}
