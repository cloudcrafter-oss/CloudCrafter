using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class FetchGitRepositoryFromGithubAppDeploymentStepGeneratorTest
    : StepBaseTest<FetchGitRepositoryFromGithubAppDeploymentStepGenerator>
{
    [Test]
    public void ShouldGenerateBuildStep()
    {
        // Arrange
        var options = new FetchGitRepositoryFromGithubAppDeploymentStepGenerator.Args
        {
            FullPathWithToken = "full-path-token",
            Path = "relative-path",
            Branch = "some-branch",
            ProviderPath = "some-provider-path",
        };
        var generator = new FetchGitRepositoryFromGithubAppDeploymentStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.FetchGitRepositoryFromProvider);
        buildStep
            .Params.Should()
            .ContainKeys("fullPathWithToken", "path", "branch", "providerPath");

        buildStep.Params["fullPathWithToken"].Should().Be("full-path-token");
        buildStep.Params["path"].Should().Be("relative-path");
        buildStep.Params["branch"].Should().Be("some-branch");
        buildStep.Params["providerPath"].Should().Be("some-provider-path");
    }
}
