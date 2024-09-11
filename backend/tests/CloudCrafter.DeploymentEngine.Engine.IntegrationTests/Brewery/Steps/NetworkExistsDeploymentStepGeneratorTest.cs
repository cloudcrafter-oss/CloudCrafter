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
        var result = Serializer.GetConfig<NetworkExistsCheckParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);

        paramObject.Networks.Count.Should().Be(1);
        paramObject.Networks.Should().BeEquivalentTo("my-network");
    }
}
