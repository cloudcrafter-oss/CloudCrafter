using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class FetchGitRepositoryDeploymentStepGeneratorTest
    : BaseParameterConversionTest<GitCheckoutParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new FetchGitRepositoryDeploymentStepGenerator.Args
        {
            Repository = "some-repository.git",
            Commit = "HEAD",
        };
        var generator = new FetchGitRepositoryDeploymentStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var handler = Serializer.GetHandler<GitCheckoutParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, handler.Validator);

        paramObject.Commit.Should().Be("HEAD");
        paramObject.Repo.Should().Be("some-repository.git");
    }
}
