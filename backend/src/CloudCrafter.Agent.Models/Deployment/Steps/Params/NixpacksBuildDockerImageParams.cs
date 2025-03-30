namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

public class NixpacksBuildDockerImageParams : NixpacksBaseParams
{
    public string Image { get; init; } = string.Empty;
    public string Tag { get; init; } = string.Empty;
    public bool? DisableCache { get; init; } = false;
    public Dictionary<string, object>? Env { get; init; }
}
