using System.Text.Json;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class NixpacksBuildDockerImageBuildStepGeneratorTest
    : BaseParameterConversionTest<NixpacksBuildDockerImageParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new NixpacksBuildDockerImageBuildStepGenerator.Args
        {
            Path = "/some/path",
            BuildArgs = new Dictionary<string, object> { { "ARG_1", 1 } },
            ImageRepository = "image",
            ImageTag = "latest",
            DisableBuildCache = true,
        };
        var generator = new NixpacksBuildDockerImageBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var result = Serializer.GetConfig<NixpacksBuildDockerImageParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);

        paramObject.Path.Should().Be("/some/path");
        paramObject.Env.Should().NotBeNull();
        paramObject.Env!.Count().Should().Be(1);
        paramObject.Env!.Should().ContainKey("ARG_1");
        var value = (JsonElement)paramObject.Env!["ARG_1"];
        value.ValueKind.Should().Be(JsonValueKind.Number);
        value.GetInt32().Should().Be(1);

        paramObject.Image.Should().Be("image");
        paramObject.Tag.Should().Be("latest");
        paramObject.DisableCache.Should().BeTrue();
    }
}
