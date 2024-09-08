using CloudCrafter.Agent.Models.Deployment.Steps.Params.DockerCompose;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class DockerComposeUpBuildStepGeneratorTest : BaseParameterConversionTest<DockerComposeUpParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options =
            new DockerComposeUpBuildStepGenerator.Args
            {
                DockerComposeFile = "docker-compose-my-test.yml", StoreServiceNames = true
            };
        var generator = new DockerComposeUpBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var result = Serializer.GetConfig<DockerComposeUpParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);

        paramObject.StoreServiceNames.Should().Be(true);
        paramObject.DockerComposeFile.Should().Be("docker-compose-my-test.yml");
    }
}
