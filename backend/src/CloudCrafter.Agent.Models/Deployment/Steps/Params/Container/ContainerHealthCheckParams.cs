using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;

[DeploymentStep(DeploymentBuildStepType.ContainerHealthCheck)]
// ReSharper disable once ClassNeverInstantiated.Global
public class ContainerHealthCheckParams : BaseParams
{
    public Dictionary<string, ContainerHealthCheckParamsOptions> Services { get; init; } = new();

    public ContainerHealthCheckParamsOptionsDockerComposeSettings? DockerComposeSettings { get; init; }
}

public class ContainerHealthCheckParamsOptions
{
    public bool? CheckForDockerHealth { get; init; }
    public string? HttpMethod { get; init; } = string.Empty;
    public string? HttpSchema { get; init; } = string.Empty;
    public string? HttpHost { get; init; } = string.Empty;
    public string? HttpPath { get; init; } = string.Empty;
    public int? HttpPort { get; init; }

    public int? ExpectedResponseCode { get; init; }
    public string? ExpectedResponseBodyContains { get; init; }

    public int? CheckInterval { get; init; }
    public int? CheckTimeout { get; init; }
    public int? Retries { get; init; }
    public int? BackOffPeriod { get; init; }
}

public class ContainerHealthCheckParamsOptionsDockerComposeSettings
{
    public bool? FetchServicesFromContext { get; init; }
}
