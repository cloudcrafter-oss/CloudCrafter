using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class NixpacksWritePlanToFsBuildStepGeneratorTest
    : StepBaseTest<NixpacksWritePlanToFsBuildStepGenerator>
{
    [Test]
    public void ShouldGenerateBuildStep()
    {
        // Arrange
        var options = new NixpacksWritePlanToFsBuildStepGenerator.Args { Path = "relative-path" };
        var generator = new NixpacksWritePlanToFsBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.NixpacksWritePlanToFileSystem);
        buildStep.Params.Should().ContainKey("path");
        buildStep.Params["path"].Should().Be("relative-path");
    }
}
