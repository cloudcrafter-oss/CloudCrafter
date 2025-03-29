using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class NixpacksBuildDockerImageBuildStepGeneratorTest
    : StepBaseTest<NixpacksBuildDockerImageBuildStepGenerator>
{
    [Test]
    [TestCase(true)]
    [TestCase(false)]
    public void ShouldGenerateBuildStep(bool disableCache)
    {
        var imageTag = "latest";
        var image = "my-image";
        var path = "my-path";
        // Arrange
        var options = new NixpacksBuildDockerImageBuildStepGenerator.Args
        {
            Path = path,
            ImageRepository = image,
            ImageTag = imageTag,
            DisableBuildCache = disableCache,
            BuildArgs = new Dictionary<string, object>
            {
                { "BUILD_ARG_ONE", 1 },
                { "BUILD_ARG_TWO", true },
                { "BUILD_ARG_THREE", "three" },
            },
        };
        var generator = new NixpacksBuildDockerImageBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.NixpacksBuildDockerImage);
        buildStep.Params.Should().ContainKeys("path", "image", "tag", "disableCache", "env");
        buildStep.Params["disableCache"].Should().Be(disableCache);
        buildStep.Params["path"].Should().Be(path);
        buildStep.Params["image"].Should().Be(image);
        buildStep.Params["tag"].Should().Be(imageTag);
        buildStep
            .Params["env"]
            .Should()
            .BeEquivalentTo(
                new Dictionary<string, object>
                {
                    { "BUILD_ARG_ONE", 1 },
                    { "BUILD_ARG_TWO", true },
                    { "BUILD_ARG_THREE", "three" },
                }
            );
    }
}
