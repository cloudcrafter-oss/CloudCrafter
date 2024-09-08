using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class RunPlainCommandParamsBuildStepGeneratorTest : BaseParameterConversionTest<RunPlainCommandParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options =
            new RunPlainCommandParamsBuildStepGenerator.Args { Command = "echo 'Hello, World!'", AllowFailure = true };
        var generator = new RunPlainCommandParamsBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var result = Serializer.GetConfig<RunPlainCommandParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);

        paramObject.AllowFailure.Should().Be(true);
        paramObject.Command.Should().Be("echo 'Hello, World!'");
    }
}
