using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class StopContainersBuildStepGeneratorTest
    : BaseParameterConversionTest<StopContainersParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new StopContainersBuildStepGenerator.Args
        {
            LabelFilters = ["some.label=1", "some.other.label!=2"],
            OnlyCloudCrafterContainers = true,
        };
        var generator = new StopContainersBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var handler = Serializer.GetHandler<StopContainersParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, handler.Validator);

        paramObject.OnlyCloudCrafterContainers.Should().Be(true);
        paramObject.Filters.Should().ContainKey("labels");
        paramObject
            .Filters["labels"]
            .Should()
            .BeEquivalentTo(["some.label=1", "some.other.label!=2"]);
    }
}
