using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class DockerComposeUpBuildStepGeneratorTest : StepBaseTest<DockerComposeUpBuildStepGenerator>
{
    [Test]
    public void ShouldGenerateBuildStep()
    {
        // Arrange
        var options = new DockerComposeUpBuildStepGenerator.Args
        {
            StoreServiceNames = true,
            DockerComposeFile = "docker-compose-test.yml",
        };
        var generator = new DockerComposeUpBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.DockerComposeUp);
        buildStep.Params.Should().ContainKey("storeServiceNames");
        buildStep.Params["storeServiceNames"].Should().Be(true);

        buildStep.Params.Should().ContainKey("dockerComposeFile");
        buildStep.Params["dockerComposeFile"].Should().Be("docker-compose-test.yml");
    }
}
