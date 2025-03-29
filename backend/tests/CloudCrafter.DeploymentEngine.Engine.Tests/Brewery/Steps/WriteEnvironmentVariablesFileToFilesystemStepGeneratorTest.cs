using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class WriteEnvironmentVariablesFileToFilesystemStepGeneratorTest
    : StepBaseTest<WriteEnvironmentVariablesFileToFilesystemStepGenerator>
{
    [Test]
    public void ShouldGenerateBuildStep()
    {
        // Arrange
        var options = new WriteEnvironmentVariablesFileToFilesystemStepGenerator.Args
        {
            FileContents = "some-contents",
            FileName = ".my-pr-123",
        };
        var generator = new WriteEnvironmentVariablesFileToFilesystemStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep
            .Type.Should()
            .Be(DeploymentBuildStepType.WriteEnvironmentVariablesFileToFilesystem);
        buildStep.Params.Should().ContainKeys("fileContents", "fileName");

        buildStep.Params["fileContents"].Should().Be("some-contents");
        buildStep.Params["fileName"].Should().Be(".my-pr-123");
    }
}
