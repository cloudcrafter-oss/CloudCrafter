using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class GenerateNixpacksPlanBuildStepGeneratorTest
{
    [Test]
    public void ShouldCreateBuildStep()
    {
        // Arrange
        var options = new GenerateNixpacksPlanBuildStepGenerator.Args { Path = "relative-path" };
        var generator = new GenerateNixpacksPlanBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.NixpacksGeneratePlan);
        buildStep.Params.Should().ContainKey("path");
        buildStep.Params["path"].Should().Be("relative-path");
    }
}
