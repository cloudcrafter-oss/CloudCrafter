using CloudCrafter.Agent.Models.IO;
using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.RecipeGenerators;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.RecipeGenerators.SimpleApp;

public class SimpleAppRecipeGeneratorTest
{
    [Test]
    public async Task ShouldBeAbleToGenerateRecipeForSimpleApp()
    {
        // Arrange
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var stack = EntityFaker.GenerateBasicAppStack(
            new EntityFaker.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = environmentId,
                DockerNetworkName = "cloudcrafter",
                StackId = stackId,
                StackServiceId = stackServiceId,
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
                SourceProvider = null,
            }
        );

        var generator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args
            {
                Stack = stack,
                DeploymentId = deploymentId,
                ProviderHelperProvider = new DummyHelperProvider(),
            }
        );

        // Act
        var result = await generator.Generate();

        var writer = new YamlRecipeWriter(result.Recipe);
        var recipe = writer.WriteString();

        // Assert
        await Verify(new { Recipe = recipe, DockerCompose = result.DockerComposeYaml });

        var reader = new YamlRecipeReader();
        var recipeFromReader = reader.FromString(recipe);
        recipeFromReader.Should().NotBeNull();
    }

    [Test]
    public async Task ShouldBeAbleToGenerateRecipeForSimpleAppWithCustomServerNetworkName()
    {
        // Arrange
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var stack = EntityFaker.GenerateBasicAppStack(
            new EntityFaker.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = environmentId,
                DockerNetworkName = "my-custom-network",
                StackId = stackId,
                StackServiceId = stackServiceId,
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
                SourceProvider = null,
            }
        );

        var generator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args
            {
                Stack = stack,
                DeploymentId = deploymentId,
                ProviderHelperProvider = new DummyHelperProvider(),
            }
        );

        // Act
        var result = await generator.Generate();

        var writer = new YamlRecipeWriter(result.Recipe);
        var recipe = writer.WriteString();

        // Assert
        await Verify(new { Recipe = recipe, DockerCompose = result.DockerComposeYaml });

        var reader = new YamlRecipeReader();
        var recipeFromReader = reader.FromString(recipe);
        recipeFromReader.Should().NotBeNull();
    }

    [Test]
    public async Task ShouldBeAbleToGenerateRecipeForSimpleAppWithoutHealthCheck()
    {
        // Arrange
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var stack = EntityFaker.GenerateBasicAppStack(
            new EntityFaker.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = environmentId,
                StackId = stackId,
                StackServiceId = stackServiceId,
                DockerNetworkName = "cloudcrafter",
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
                SourceProvider = null,
                HealthcheckConfiguration = new EntityHealthcheckConfiguration
                {
                    HttpHost = null,
                    HttpMethod = null,
                    HttpPath = null,
                    HttpPort = null,
                    HttpSchema = null,
                },
            }
        );

        var generator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args
            {
                Stack = stack,
                DeploymentId = deploymentId,
                ProviderHelperProvider = new DummyHelperProvider(),
            }
        );

        // Act
        var result = await generator.Generate();

        var writer = new YamlRecipeWriter(result.Recipe);
        var recipe = writer.WriteString();

        // Assert
        await Verify(recipe);

        var reader = new YamlRecipeReader();
        var recipeFromReader = reader.FromString(recipe);
        recipeFromReader.Should().NotBeNull();
    }

    [Test]
    public async Task ShouldBeAbleToGenerateRecipeForSimpleAppWithoutHealthCheckForGithubApp()
    {
        // Arrange
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var sourceProvider = new SourceProvider
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Name = "Github OSS Test",
            GithubProviderId = Guid.NewGuid(),
        };

        var stack = EntityFaker.GenerateBasicAppStack(
            new EntityFaker.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = environmentId,
                StackId = stackId,
                StackServiceId = stackServiceId,
                DockerNetworkName = "cloudcrafter",
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
                SourceProvider = new SourceProvider
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Name = "Github OSS Test",
                    GithubProviderId = Guid.NewGuid(),
                    GithubProvider = new GithubProvider
                    {
                        Id = Guid.NewGuid(),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        InstallationId = 58413956,
                        AppName = "[CI TESTS] CloudCrafter-OSS",
                        AppId = 1087937,
                        AppClientId = "dummy",
                        AppClientSecret = "dummy",
                        AppWebhookSecret = "dummy",
                        AppUrl = "https://github.com/apps/ci-tests-cloudcrafter-oss",
                        AppPrivateKey = """
                        dummy
                        """,
                        IsValid = true,
                        SourceProvider = sourceProvider,
                    },
                },
                HealthcheckConfiguration = new EntityHealthcheckConfiguration
                {
                    HttpHost = null,
                    HttpMethod = null,
                    HttpPath = null,
                    HttpPort = null,
                    HttpSchema = null,
                },
            }
        );

        var generator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args
            {
                Stack = stack,
                DeploymentId = deploymentId,
                ProviderHelperProvider = new DummyHelperProvider(),
            }
        );

        // Act
        var result = await generator.Generate();

        var writer = new YamlRecipeWriter(result.Recipe);
        var recipe = writer.WriteString();

        // Assert
        await Verify(recipe);

        var reader = new YamlRecipeReader();
        var recipeFromReader = reader.FromString(recipe);
        recipeFromReader.Should().NotBeNull();
    }

    [Test]
    public async Task ShouldBeAbleToGenerateRecipeForSimpleAppWithEnvironmentVariables()
    {
        // Arrange
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var stack = EntityFaker.GenerateBasicAppStack(
            new EntityFaker.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = environmentId,
                DockerNetworkName = "cloudcrafter",
                StackId = stackId,
                StackServiceId = stackServiceId,
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
                SourceProvider = null,
            }
        );

        var envVarRuntime = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.Key, "RUNTIME_ENV_VAR")
            .RuleFor(x => x.Value, "runtime_value")
            .RuleFor(x => x.Type, EnvironmentVariableType.Runtime)
            .Generate();

        var envVarBuild = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.Key, "BUILDTIME_ENV_VAR")
            .RuleFor(x => x.Value, "buildtime_value")
            .RuleFor(x => x.Type, EnvironmentVariableType.BuildTime)
            .Generate();

        var envVarBoth = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.Key, "BOTH_ENV_VAR")
            .RuleFor(x => x.Value, "both_value")
            .RuleFor(x => x.Type, EnvironmentVariableType.Both)
            .Generate();

        stack.EnvironmentVariables.AddRange([envVarRuntime, envVarBuild, envVarBoth]);

        var generator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args
            {
                Stack = stack,
                DeploymentId = deploymentId,
                ProviderHelperProvider = new DummyHelperProvider(),
            }
        );

        // Act
        var result = await generator.Generate();

        var writer = new YamlRecipeWriter(result.Recipe);
        var recipe = writer.WriteString();

        // Assert
        await Verify(new { Recipe = recipe, DockerCompose = result.DockerComposeYaml });

        var reader = new YamlRecipeReader();
        var recipeFromReader = reader.FromString(recipe);
        recipeFromReader.Should().NotBeNull();
    }
}
