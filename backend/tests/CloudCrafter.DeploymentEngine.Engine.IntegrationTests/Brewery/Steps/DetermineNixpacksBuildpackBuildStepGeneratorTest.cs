using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class DetermineNixpacksBuildpackBuildStepGeneratorTest : BaseParameterConversionTest<NixpacksDetermineBuildPackParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options =
            new DetermineNixpacksBuildpackBuildStepGenerator.Args
            {
                Path = "/some/path"
            };
        var generator = new DetermineNixpacksBuildpackBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var result = Serializer.GetConfig<NixpacksDetermineBuildPackParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);

        paramObject.Path.Should().Be("/some/path");
    }
}
