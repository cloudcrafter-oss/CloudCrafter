using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class StopContainersBuildStepGenerator(StopContainersBuildStepGenerator.Args options)
    : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        var filters = new Dictionary<string, List<string>>();

        var labelFilters = options.LabelFilters;
        if (labelFilters.Count > 0)
        {
            filters.Add("labels", labelFilters);
        }

        return new DeploymentBuildStep
        {
            Name = "Stop Containers",
            Description = "Stops containers based on filter",
            Type = DeploymentBuildStepType.StopContainers,
            Params = new Dictionary<string, object>
            {
                { "filters", filters },
                { "onlyCloudCrafterContainers", options.OnlyCloudCrafterContainers },
            },
        };
    }

    public class Args
    {
        public List<string> LabelFilters { get; init; } = new();
        public required bool OnlyCloudCrafterContainers { get; init; }
    }
}
