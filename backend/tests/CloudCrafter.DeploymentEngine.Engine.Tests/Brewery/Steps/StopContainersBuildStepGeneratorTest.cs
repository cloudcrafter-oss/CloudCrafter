using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class StopContainersBuildStepGeneratorTest : StepBaseTest<StopContainersBuildStepGenerator>
{
    [TestCase(true)]
    [TestCase(false)]
    public void ShouldGenerateBuildStep(bool onlyCloudCraftContainers)
    {
        // Arrange
        var options = new StopContainersBuildStepGenerator.Args
        {
            LabelFilters = ["label1=value", "label2=value"],
            OnlyCloudCrafterContainers = onlyCloudCraftContainers,
        };
        var generator = new StopContainersBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.StopContainers);
        buildStep.Params.Should().ContainKeys("filters", "onlyCloudCrafterContainers");

        buildStep
            .Params["filters"]
            .Should()
            .BeEquivalentTo(
                new Dictionary<string, string[]>
                {
                    { "labels", new[] { "label1=value", "label2=value" } },
                }
            );
        buildStep.Params["onlyCloudCrafterContainers"].Should().Be(onlyCloudCraftContainers);
    }
}
