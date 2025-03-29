using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class NetworkExistsDeploymentStepGeneratorTest
    : StepBaseTest<NetworkExistsDeploymentStepGenerator>
{
    [Test]
    public void ValidateStepGeneration()
    {
        // Arrange
        var networkName = "test-network";
        var generator = new NetworkExistsDeploymentStepGenerator(networkName);

        // Act
        var step = generator.Generate();

        // Assert
        step.Type.Should().Be(DeploymentBuildStepType.DockerValidateNetworksExists);
        step.Params.Should().ContainKey("networks");
        step.Params["networks"].Should().BeOfType<List<string>>();
        step.Params["networks"].Should().BeEquivalentTo(new List<string> { networkName });
    }
}
