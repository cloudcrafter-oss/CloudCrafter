using CloudCrafter.DockerCompose.Shared.Labels;

namespace CloudCrafter.Agent.Models.Docker.Filters;

public class DockerContainerFilter
{
    public List<Guid> CloudCrafterApplicationIds { get; init; } = new();
    
    public List<DockerLabelFilter> LabelFilters { get; set; } = new();

    public Dictionary<string, bool> GetCloudCrafterApplications()
    {
        return CloudCrafterApplicationIds.ToDictionary(x => LabelFactory.GenerateApplicationLabel(x).ToLabelString(), _ => true);
    }
}
