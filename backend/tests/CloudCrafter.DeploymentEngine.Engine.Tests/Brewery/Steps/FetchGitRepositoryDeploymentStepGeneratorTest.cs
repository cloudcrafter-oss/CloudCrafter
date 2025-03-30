using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class FetchGitRepositoryDeploymentStepGeneratorTest
    : StepBaseTest<FetchGitRepositoryDeploymentStepGenerator>
{
    [Test]
    public void ShouldGenerateDeploymentStep()
    {
        // Arrange
        var options = new FetchGitRepositoryDeploymentStepGenerator.Args
        {
            Repository = "https://github.com/cloudcrafter-oss/demo-examples.git",
            Commit = "HEAD",
        };

        var generator = new FetchGitRepositoryDeploymentStepGenerator(options);

        // Act
        var step = generator.Generate();

        // Assert
        step.Type.Should().Be(DeploymentBuildStepType.FetchPublicGitRepository);
        step.Params.Should().ContainKey("repo");
        step.Params.Should().ContainKey("commit");
        step.Params["repo"].Should().Be(options.Repository);
        step.Params["commit"].Should().Be(options.Commit);
    }
}
