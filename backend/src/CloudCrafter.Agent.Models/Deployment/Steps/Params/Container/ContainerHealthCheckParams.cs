using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;

[DeploymentStep(DeploymentBuildStepType.ContainerHealthCheck)]
// ReSharper disable once ClassNeverInstantiated.Global
public class ContainerHealthCheckParams
{
    public string ContainerName { get; init; } = string.Empty;
    public ContainerHealthCheckParamsOptions? Options { get; init; }
}

public class ContainerHealthCheckParamsOptions
{
    public string HttpMethod { get; init; } = string.Empty;
    public string HttpSchema { get; init; } = string.Empty;
    public string HttpHost { get; init; } = string.Empty;
    public int? HttpPort { get; init; }

    public int? ExpectedResponseCode { get; init; }
    public string? ExpectedResponseBodyContains { get; init; }

    public int? CheckInterval { get; init; }
    public int? CheckTimeout { get; init; }
    public int? Retries { get; init; }
    public int? BackOffPeriod { get; init; }
}
