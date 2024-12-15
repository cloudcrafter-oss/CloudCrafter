using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class FetchGitRepositoryFromGithubAppDeploymentStepGeneratorTest
    : BaseParameterConversionTest<GitCheckoutFromSourceProviderParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new FetchGitRepositoryFromGithubAppDeploymentStepGenerator.Args
        {
            Repository = "some-repository.git",
            Branch = "main",
            RepositoryId = "1234",
            AccessToken = "some-access-token",
        };
        var generator = new FetchGitRepositoryFromGithubAppDeploymentStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var handler = Serializer.GetHandler<GitCheckoutFromSourceProviderParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, handler.Validator);

        paramObject.Repository.Should().Be("some-repository.git");
        paramObject.Branch.Should().Be("main");
        paramObject.RepositoryId.Should().Be("1234");
        paramObject.AccessToken.Should().Be("some-access-token");
    }
}
