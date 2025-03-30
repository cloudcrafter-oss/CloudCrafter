namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;

public class DockerComposeWriteToFileSystemParams : BaseParams
{
    public string DockerComposeFile { get; init; } = string.Empty;
}
