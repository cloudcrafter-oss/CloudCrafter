using CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

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

        // Assert
        var result = Serializer.GetConfig<DockerComposeWriteToFileSystemParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);

        paramObject.DockerComposeFile.Should().Be("docker-compose-testing.yml");
    }
}
