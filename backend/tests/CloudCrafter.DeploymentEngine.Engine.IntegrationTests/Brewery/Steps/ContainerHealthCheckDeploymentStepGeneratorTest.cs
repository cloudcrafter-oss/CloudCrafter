using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class ContainerHealthCheckDeploymentStepGeneratorTest
    : BaseParameterConversionTest<ContainerHealthCheckParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new ContainerHealthCheckDeploymentStepGenerator.Args
        {
            DockerComposeSettings = new() { FetchServicesFromContext = true },
            Services = new Dictionary<
                string,
                ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
            >()
            {
                {
                    "frontend",
                    new ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings()
                    {
                        HttpMethod = "GET",
                        HttpSchema = "http",
                        HttpHost = "localhost",
                        HttpPath = "/",
                        HttpPort = 80,
                        ExpectedHttpStatusCode = 200,
                        MaxRetries = 3,
                    }
                },
            },
        };
        var generator = new ContainerHealthCheckDeploymentStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var result = Serializer.GetConfig<ContainerHealthCheckParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);

        paramObject.DockerComposeSettings.Should().NotBeNull();
        paramObject.DockerComposeSettings!.FetchServicesFromContext.Should().BeTrue();
        paramObject.Services.Count().Should().Be(1);
        paramObject.Services["frontend"].HttpMethod.Should().Be("GET");
        paramObject.Services["frontend"].HttpSchema.Should().Be("http");
        paramObject.Services["frontend"].HttpHost.Should().Be("localhost");
        paramObject.Services["frontend"].HttpPath.Should().Be("/");
        paramObject.Services["frontend"].HttpPort.Should().Be(80);
        paramObject.Services["frontend"].ExpectedResponseCode.Should().Be(200);
        paramObject.Services["frontend"].Retries.Should().Be(3);
        paramObject.Services["frontend"].CheckInterval.Should().BeNull();
        paramObject.Services["frontend"].CheckTimeout.Should().BeNull();
        paramObject.Services["frontend"].BackOffPeriod.Should().BeNull();
    }
}
