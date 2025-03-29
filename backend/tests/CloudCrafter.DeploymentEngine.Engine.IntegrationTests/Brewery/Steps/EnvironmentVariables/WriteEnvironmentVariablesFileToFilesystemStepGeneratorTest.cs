using CloudCrafter.Agent.Models.Deployment.Steps.Params.EnvironmentFiles;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps.EnvironmentVariables;

public class WriteEnvironmentVariablesFileToFilesystemStepGeneratorTest
    : BaseParameterConversionTest<WriteEnvironmentVariablesFileToFilesystemParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new WriteEnvironmentVariablesFileToFilesystemStepGenerator.Args
        {
            FileName = ".env-pr-123",
            FileContents = "TEST=123",
        };
        var generator = new WriteEnvironmentVariablesFileToFilesystemStepGenerator(options);

        // Act
        var buildStep = generator.Generate();
        var handler = Serializer.GetHandler<WriteEnvironmentVariablesFileToFilesystemParams>(
            buildStep
        );
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, handler.Validator);

        // Assert
        buildStep
            .Type.Should()
            .Be(DeploymentBuildStepType.WriteEnvironmentVariablesFileToFilesystem);
        paramObject.FileContents.Should().Be("TEST=123");
        paramObject.FileName.Should().Be(".env-pr-123");
    }
}
