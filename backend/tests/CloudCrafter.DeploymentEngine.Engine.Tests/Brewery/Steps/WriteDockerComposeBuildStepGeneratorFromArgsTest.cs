using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class WriteDockerComposeBuildStepGeneratorFromArgsTest
    : StepBaseTest<WriteDockerComposeBuildStepGenerator>
{
    [Test]
    public void ShouldBeAbleToGenerateStep()
    {
        // Arrange
        var options = new WriteDockerComposeBuildStepGenerator.Args
        {
            DockerComposeFileName = "docker-compose.yml",
        };
        var generator = new WriteDockerComposeBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.DockerComposeWriteToFileSystem);
        buildStep.Params.Should().ContainKey("dockerComposeFile");
        buildStep.Params["dockerComposeFile"].Should().Be("docker-compose.yml");
    }
}
