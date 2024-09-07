using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class FetchGitRepositoryDeploymentStepGeneratorTest
{
    [Test]
    public void ShouldGenerateDeploymentStep()
    {
        // Arrange
        var options = new FetchGitRepositoryDeploymentStepGenerator.Args
        {
            Repository = "https://github.com/cloudcrafter-oss/demo-examples.git", Commit = "HEAD"
        };

        var generator = new FetchGitRepositoryDeploymentStepGenerator(options);

        // Act
        var step = generator.Generate();

        // Assert
        step.Type.Should().Be(DeploymentBuildStepType.FetchGitRepository);
        step.Params.Should().ContainKey("repository");
        step.Params.Should().ContainKey("commit");
        step.Params["repository"].Should().Be(options.Repository);
        step.Params["commit"].Should().Be(options.Commit);
    }
}
