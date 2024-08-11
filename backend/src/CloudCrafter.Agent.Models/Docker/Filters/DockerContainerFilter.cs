using CloudCrafter.DockerCompose.Shared.Labels;

namespace CloudCrafter.Agent.Models.Docker.Filters;

public class DockerContainerFilter
{
    public bool? OnlyCloudCrafterLabels { get; set; }
    public List<DockerLabelFilter> LabelFilters { get; set; } = new();
}
