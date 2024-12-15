namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;

public class DockerComposeUpParams : BaseParams
{
    public string DockerComposeFile { get; init; } = string.Empty;
    public bool? StoreServiceNames { get; init; }
}
