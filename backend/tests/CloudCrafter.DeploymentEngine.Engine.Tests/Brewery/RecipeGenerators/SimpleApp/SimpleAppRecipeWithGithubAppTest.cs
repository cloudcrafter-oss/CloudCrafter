using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.Core.Services.Domain.Providers;
using CloudCrafter.Core.Services.Domain.Providers.Github;
using CloudCrafter.Core.Services.Domain.Providers.Proxy;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.RecipeGenerators;
using CloudCrafter.Domain.Entities;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Environment = System.Environment;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.RecipeGenerators.SimpleApp;

public class SimpleAppRecipeWithGithubAppTest
{
    [Test]
    public async Task ShouldBeAbleToGenerateRecipeForSimpleAppWithoutHealthCheckForGithubAppWithRealToken()
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
                        AppId = long.Parse(
                            Environment.GetEnvironmentVariable("TESTS_GITHUB_APP_APP_ID") ?? "0"
                        ),
                        AppClientId = Environment.GetEnvironmentVariable(
                            "TESTS_GITHUB_APP_CLIENT_ID"
                        ),
                        AppClientSecret = Environment.GetEnvironmentVariable(
                            "TESTS_GITHUB_APP_CLIENT_SECRET"
                        ),
                        AppWebhookSecret = Environment.GetEnvironmentVariable(
                            "TESTS_GITHUB_APP_WEBHOOK_SECRET"
                        ),
                        AppUrl = Environment.GetEnvironmentVariable("TESTS_GITHUB_APP_URL"),
                        AppPrivateKey = Environment.GetEnvironmentVariable(
                            "TESTS_GITHUB_APP_PRIVATE_KEY"
                        ),
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

        var githubProviderService = new GithubSourceProviderService(
            new Logger<GithubSourceProviderService>(new LoggerFactory()),
            new GithubBackendClientProvider(new GithubClientProvider()),
            new GithubClientProvider()
        );

        var proxy = new SourceProviderHelperService(new SourceProviderProxy(githubProviderService));

        var generator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args
            {
                Stack = stack,
                DeploymentId = deploymentId,
                ProviderHelperProvider = proxy,
            }
        );

        // Act
        var result = await generator.Generate();

        var githubCheckoutStep = result.Recipe.BuildOptions.Steps.FirstOrDefault(x =>
            x.Type == DeploymentBuildStepType.FetchGitRepositoryFromProvider
        );

        githubCheckoutStep.Should().NotBeNull();

        githubCheckoutStep!.Params["fullPathWithToken"].Should().NotBeNull();

        githubCheckoutStep.Params["providerPath"].Should().Be("cloudcrafter-oss/ci-private-tests");

        var fullPath = (string)githubCheckoutStep.Params["fullPathWithToken"];
        fullPath.Should().NotBeEmpty();
        fullPath.Should().Contain("cloudcrafter-oss/ci-private-tests");
    }
}
