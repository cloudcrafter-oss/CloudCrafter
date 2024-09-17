using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

namespace CloudCrafter.Tests.E2E.DeploymentSteps.Types;

public class ContainerHealthCheckTest : BaseStepTest
{
    [Test]
    public async Task ShouldHaveValidStepWhenUsingDefaultValues()
    {
        // Arrange
        var generator = new ContainerHealthCheckDeploymentStepGenerator(
            new ContainerHealthCheckDeploymentStepGenerator.Args
            {
                DockerComposeSettings =
                    new ContainerHealthCheckDeploymentStepGenerator.ArgsComposeSettings
                    {
                        FetchServicesFromContext = true,
                    },
                Services =
                    new Dictionary<
                        string,
                        ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
                    >(),
            }
        );
        var step = generator.Generate();

        var recipe = GetRecipeWithStep(step);

        // Act
        var yaml = GetYaml(recipe);

        await Verify(yaml);

        var deserializedRecipe = GetFromYaml(yaml);

        var buildStepFromRecipe = deserializedRecipe.BuildOptions.Steps.FirstOrDefault();
        buildStepFromRecipe.Should().NotBeNull();
        var buildStep = Validate<ContainerHealthCheckParams>(buildStepFromRecipe!);

        // Assert
        buildStep.Should().NotBeNull();
        buildStep.DockerComposeSettings.Should().NotBeNull();
        buildStep.DockerComposeSettings!.FetchServicesFromContext.Should().BeTrue();
        buildStep.Services.Should().BeEmpty();

        await DryRunStep(buildStepFromRecipe!, deserializedRecipe);
    }

    [Test]
    public async Task ShouldHaveValidStepWithSimpleService()
    {
        // Arrange
        var generator = new ContainerHealthCheckDeploymentStepGenerator(
            new ContainerHealthCheckDeploymentStepGenerator.Args
            {
                DockerComposeSettings =
                    new ContainerHealthCheckDeploymentStepGenerator.ArgsComposeSettings
                    {
                        FetchServicesFromContext = true,
                    },
                Services = new Dictionary<
                    string,
                    ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
                >
                {
                    {
                        "service-one",
                        new ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
                        {
                            HttpSchema = "http",
                            HttpPath = "/health",
                            HttpPort = 80,
                            HttpMethod = "GET",
                            HttpHost = "localhost",
                            ExpectedHttpStatusCode = 200,
                            CheckForDockerHealth = true,
                            MaxRetries = 5,
                        }
                    },
                },
            }
        );
        var step = generator.Generate();

        var recipe = GetRecipeWithStep(step);

        // Act
        var yaml = GetYaml(recipe);

        await Verify(yaml);

        var deserializedRecipe = GetFromYaml(yaml);

        var buildStepFromRecipe = deserializedRecipe.BuildOptions.Steps.FirstOrDefault();
        buildStepFromRecipe.Should().NotBeNull();
        var buildStep = Validate<ContainerHealthCheckParams>(buildStepFromRecipe!);

        // Assert
        buildStep.Should().NotBeNull();
        buildStep.DockerComposeSettings.Should().NotBeNull();
        buildStep.DockerComposeSettings!.FetchServicesFromContext.Should().BeTrue();
        buildStep.Services.Should().HaveCount(1);
        buildStep.Services.Should().ContainKey("service-one");
        buildStep
            .Services["service-one"]
            .Should()
            .BeEquivalentTo(
                new ContainerHealthCheckParamsOptions
                {
                    HttpSchema = "http",
                    HttpPath = "/health",
                    HttpPort = 80,
                    HttpMethod = "GET",
                    HttpHost = "localhost",
                    ExpectedResponseCode = 200,
                    CheckForDockerHealth = true,
                    Retries = 5,
                }
            );
        await DryRunStep(buildStepFromRecipe!, deserializedRecipe);
    }

    [Test]
    public async Task ShouldHaveValidStepWithEmptyHealthCheck()
    {
        // Arrange
        var generator = new ContainerHealthCheckDeploymentStepGenerator(
            new ContainerHealthCheckDeploymentStepGenerator.Args
            {
                DockerComposeSettings =
                    new ContainerHealthCheckDeploymentStepGenerator.ArgsComposeSettings
                    {
                        FetchServicesFromContext = true,
                    },
                Services = new Dictionary<
                    string,
                    ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
                >
                {
                    {
                        "service-one",
                        new ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
                        {
                            HttpMethod = null,
                            HttpSchema = null,
                            HttpHost = null,
                            HttpPath = null,
                            HttpPort = null,
                            ExpectedHttpStatusCode = null,
                            CheckForDockerHealth = true,
                            MaxRetries = null,
                        }
                    },
                },
            }
        );
        var step = generator.Generate();

        var recipe = GetRecipeWithStep(step);

        // Act
        var yaml = GetYaml(recipe);

        await Verify(yaml);

        var deserializedRecipe = GetFromYaml(yaml);

        var buildStepFromRecipe = deserializedRecipe.BuildOptions.Steps.FirstOrDefault();
        buildStepFromRecipe.Should().NotBeNull();
        var buildStep = Validate<ContainerHealthCheckParams>(buildStepFromRecipe!);

        // Assert
        buildStep.Should().NotBeNull();
        buildStep.DockerComposeSettings.Should().NotBeNull();
        buildStep.DockerComposeSettings!.FetchServicesFromContext.Should().BeTrue();
        buildStep.Services.Should().HaveCount(1);
        buildStep.Services.Should().ContainKey("service-one");
        buildStep
            .Services["service-one"]
            .Should()
            .BeEquivalentTo(
                new ContainerHealthCheckParamsOptions
                {
                    HttpSchema = null,
                    HttpPath = null,
                    HttpPort = null,
                    HttpMethod = null,
                    HttpHost = null,
                    ExpectedResponseCode = null,
                    CheckForDockerHealth = true,
                    Retries = null,
                }
            );

        await DryRunStep(buildStepFromRecipe!, deserializedRecipe);
    }
}
