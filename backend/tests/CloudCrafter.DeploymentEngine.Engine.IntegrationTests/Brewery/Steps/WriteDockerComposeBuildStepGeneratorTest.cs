using CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class WriteDockerComposeBuildStepGeneratorTest
    : BaseParameterConversionTest<DockerComposeWriteToFileSystemParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new WriteDockerComposeBuildStepGenerator.Args
        {
            DockerComposeFileName = "docker-compose-testing.yml",
        };
        var generator = new WriteDockerComposeBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();
        var handler = Serializer.GetHandler<DockerComposeWriteToFileSystemParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, handler.Validator);

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.DockerComposeWriteToFileSystem);
        paramObject.DockerComposeFile.Should().Be("docker-compose-testing.yml");
    }
}
