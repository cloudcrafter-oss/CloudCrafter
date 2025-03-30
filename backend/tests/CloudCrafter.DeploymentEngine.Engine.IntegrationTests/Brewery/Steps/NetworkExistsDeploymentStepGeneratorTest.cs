using CloudCrafter.Agent.Models.Deployment.Steps.Params.Network;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class NetworkExistsDeploymentStepGeneratorTest
    : BaseParameterConversionTest<NetworkExistsCheckParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var generator = new NetworkExistsDeploymentStepGenerator("my-network");

        // Act
        var buildStep = generator.Generate();

        // Assert
        var handler = Serializer.GetHandler<NetworkExistsCheckParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, handler.Validator);

        paramObject.Networks.Count.Should().Be(1);
        paramObject.Networks.Should().BeEquivalentTo("my-network");
    }
}
