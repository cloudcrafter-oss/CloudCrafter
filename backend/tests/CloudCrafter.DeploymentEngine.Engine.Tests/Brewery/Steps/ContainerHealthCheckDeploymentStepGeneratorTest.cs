using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class ContainerHealthCheckDeploymentStepGeneratorTest
{
    [Test]
    public void ShouldBeAbleToGenerateStep()
    {
        // Arrange
        var options = new ContainerHealthCheckDeploymentStepGenerator.Args
        {
            DockerComposeSettings =
                new ContainerHealthCheckDeploymentStepGenerator.ArgsComposeSettings
                {
                    FetchServicesFromContext = true,
                },
            Services = new Dictionary<
                string,
                ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
            >
            {
                {
                    "service1",
                    new ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
                    {
                        HttpMethod = "GET",
                        HttpSchema = "http",
                        HttpHost = "localhost",
                        HttpPath = "/health",
                        HttpPort = 80,
                        ExpectedHttpStatusCode = 200,
                        MaxRetries = 3,
                        CheckForDockerHealth = true,
                    }
                },
            },
        };

        var generator = new ContainerHealthCheckDeploymentStepGenerator(options);

        // Act
        var result = generator.Generate();

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Container health check");
        result.Description.Should().Be("Checks the health of the containers");
        result.Type.Should().Be(DeploymentBuildStepType.ContainerHealthCheck);
        result.Params.Should().ContainKey("dockerComposeSettings");
        result.Params.Should().ContainKey("services");
        var services = result.Params["services"] as Dictionary<string, Dictionary<string, object>>;
        services.Should().ContainKey("service1");
        var serviceCheck = services!["service1"];
        serviceCheck.Should().ContainKey("httpMethod").WhoseValue.Should().Be("GET");
        serviceCheck.Should().ContainKey("httpSchema").WhoseValue.Should().Be("http");
        serviceCheck.Should().ContainKey("httpHost").WhoseValue.Should().Be("localhost");
        serviceCheck.Should().ContainKey("httpPath").WhoseValue.Should().Be("/health");
        serviceCheck.Should().ContainKey("httpPort").WhoseValue.Should().Be(80);
        serviceCheck.Should().ContainKey("expectedResponseCode").WhoseValue.Should().Be(200);
        serviceCheck.Should().ContainKey("retries").WhoseValue.Should().Be(3);
        serviceCheck.Should().ContainKey("checkForDockerHealth").WhoseValue.Should().Be(true);
    }
}
