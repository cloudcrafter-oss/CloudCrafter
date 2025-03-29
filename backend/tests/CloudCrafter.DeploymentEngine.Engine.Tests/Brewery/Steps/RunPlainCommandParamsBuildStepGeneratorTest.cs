using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class RunPlainCommandParamsBuildStepGeneratorTest
    : StepBaseTest<RunPlainCommandParamsBuildStepGenerator>
{
    [TestCase(true)]
    [TestCase(false)]
    public void ShouldGenerateBuildStep(bool allowFailure)
    {
        // Arrange
        var options = new RunPlainCommandParamsBuildStepGenerator.Args
        {
            Command = "some-command",
            AllowFailure = allowFailure,
        };
        var generator = new RunPlainCommandParamsBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.RunPlainCommand);
        buildStep.Params.Should().ContainKeys("command", "allowFailure");

        buildStep.Params["command"].Should().Be("some-command");
        buildStep.Params["allowFailure"].Should().Be(allowFailure);
    }
}
