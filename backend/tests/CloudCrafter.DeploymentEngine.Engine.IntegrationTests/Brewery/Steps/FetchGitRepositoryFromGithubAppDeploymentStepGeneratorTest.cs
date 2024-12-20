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
            FullPathWithToken =
                "https://x-access-token:dummy@github.com/cloudcrafter-oss/ci-private-tests",
            ProviderPath = "cloudcrafter-oss/ci-private-tests",
            Branch = "main",
            Path = "/",
        };
        var generator = new FetchGitRepositoryFromGithubAppDeploymentStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var handler = Serializer.GetHandler<GitCheckoutFromSourceProviderParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, handler.Validator);

        paramObject.FullPathWithToken.Should().Be(options.FullPathWithToken);
        paramObject.ProviderPath.Should().Be(options.ProviderPath);
        paramObject.Path.Should().Be(options.Path);
        paramObject.Branch.Should().Be(options.Branch);
    }
}
