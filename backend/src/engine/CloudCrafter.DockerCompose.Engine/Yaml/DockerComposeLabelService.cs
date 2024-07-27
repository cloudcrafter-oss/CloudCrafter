using CloudCrafter.DockerCompose.Shared.Labels;

namespace CloudCrafter.DockerCompose.Engine.Yaml;

public class DockerComposeLabelService
{
    private Dictionary<string, string> _labels = new();

    public void AddLabel(CloudCrafterLabel label)
    {
        var dockerComposeLabel = label.ToDockerComposeLabel();
        _labels.Add(dockerComposeLabel.Item1, dockerComposeLabel.Item2);
    }

    public void AddTraefikLabels(DockerComposeLabelServiceTraefikOptions traefikOptions)
    {
        AddLabel("traefik.enable", "true");
        AddLabel($"traefik.http.routers.{traefikOptions.Service}.rule", traefikOptions.Rule);
        AddLabel($"traefik.http.routers.{traefikOptions.Service}.entrypoints", "web");
    }

    private void AddLabel(string key, string value)
    {
        if (!_labels.TryAdd(key, value))
        {
            throw new ArgumentException($"Label with key {key} already exists");
        }
    }


    public List<string> ToLabelList()
    {
        return _labels.Select(x => $"{x.Key}={x.Value}").ToList();
    }
    
    public Dictionary<string, string> ToDictionary()
    {
        return _labels;
    }
}

public class DockerComposeLabelServiceTraefikOptions
{
    public required string Service { get; init; }
    public required string Rule { get; init; }
}
