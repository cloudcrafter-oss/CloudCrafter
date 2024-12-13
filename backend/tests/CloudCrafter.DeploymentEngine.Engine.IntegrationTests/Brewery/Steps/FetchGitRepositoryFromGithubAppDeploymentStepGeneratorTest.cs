// using CloudCrafter.Agent.Models.Deployment.Steps.Params;
// using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
// using FluentAssertions;
//
// namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;
//
// public class FetchGitRepositoryFromGithubAppDeploymentStepGeneratorTest
//     : BaseParameterConversionTest<GitCheckoutFromSourceProviderParams>
// {
//     [Test]
//     public void ShouldBeAbleToCreateParams()
//     {
//         // Arrange
//         var options = new FetchGitRepositoryFromGithubAppDeploymentStepGenerator.Args
//         {
//             Repository = "some-repository.git",
//             Branch = "main",
//         };
//         var generator = new FetchGitRepositoryFromGithubAppDeploymentStepGenerator(options);
//
//         // Act
//         var buildStep = generator.Generate();
//
//         // Assert
//         var result = Serializer.GetConfig<GitCheckoutFromSourceProviderParams>(buildStep);
//         var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);
//
//         paramObject.Commit.Should().Be("HEAD");
//         paramObject.Repo.Should().Be("some-repository.git");
//     }
// }
