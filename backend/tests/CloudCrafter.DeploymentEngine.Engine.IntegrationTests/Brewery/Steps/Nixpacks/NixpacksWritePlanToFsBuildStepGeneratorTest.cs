using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps.Nixpacks;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps.Nixpacks;

public class NixpacksWritePlanToFsBuildStepGeneratorTest
    : BaseParameterConversionTest<NixpacksWritePlanToFileSystemParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new NixpacksWritePlanToFsBuildStepGenerator.Args { Path = "/some/path" };
        var generator = new NixpacksWritePlanToFsBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var handler = Serializer.GetHandler<NixpacksWritePlanToFileSystemParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, handler.Validator);

        paramObject.Path.Should().Be("/some/path");
    }
}
