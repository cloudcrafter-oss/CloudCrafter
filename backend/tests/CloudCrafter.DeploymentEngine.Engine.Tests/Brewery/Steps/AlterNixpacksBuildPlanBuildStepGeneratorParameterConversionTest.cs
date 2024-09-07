using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class AlterNixpacksBuildPlanBuildStepGeneratorParameterConversionTest
{
    [Test]
    public void ShouldGenerateBuildStep()
    {
        // Arrange
        var options =
            new AlterNixpacksBuildPlanBuildStepGeneratorParameterConversion.Args
            {
                AddPackages = new List<string> { "package1", "package2" }
            };
        var generator = new AlterNixpacksBuildPlanBuildStepGeneratorParameterConversion(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.NixpacksAlterPlan);
        buildStep.Params.Should().ContainKey("packages");
        buildStep.Params["packages"].Should().BeEquivalentTo(new List<string> { "package1", "package2" });
    }
}
