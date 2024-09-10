using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class ContainerHealthCheckDeploymentStepGenerator(
    ContainerHealthCheckDeploymentStepGenerator.Args options
) : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        var services = options.Services.ToDictionary(
            service => service.Key,
            service => GenerateServiceCheck(service.Value)
        );

        return new DeploymentBuildStep
        {
            Name = "Container health check",
            Description = "Checks the health of the containers",
            Type = DeploymentBuildStepType.ContainerHealthCheck,
            Params = new Dictionary<string, object>
            {
                {
                    "dockerComposeSettings",
                    new Dictionary<string, object>
                    {
                        {
                            "fetchServicesFromContext",
                            options.DockerComposeSettings.FetchServicesFromContext
                        },
                    }
                },
                { "services", services },
            },
        };
    }

    private Dictionary<string, object> GenerateServiceCheck(ArgsHealthCheckSettings settings)
    {
        return new Dictionary<string, object>
        {
            { "httpMethod", settings.HttpMethod },
            { "httpSchema", settings.HttpSchema },
            { "httpHost", settings.HttpHost },
            { "httpPath", settings.HttpPath },
            { "httpPort", settings.HttpPort },
            { "expectedResponseCode", settings.ExpectedHttpStatusCode },
            { "retries", settings.MaxRetries },
        };
    }

    public class Args
    {
        public required ArgsComposeSettings DockerComposeSettings { get; init; }
        public required Dictionary<string, ArgsHealthCheckSettings> Services { get; init; }
    }

    public class ArgsComposeSettings
    {
        public required bool FetchServicesFromContext { get; init; }
    }

    public class ArgsHealthCheckSettings
    {
        public required string HttpMethod { get; init; }
        public required string HttpSchema { get; init; }
        public required string HttpHost { get; init; }
        public required string HttpPath { get; init; }
        public required int HttpPort { get; init; }
        public required int ExpectedHttpStatusCode { get; init; }
        public required int MaxRetries { get; init; }
    }
}
