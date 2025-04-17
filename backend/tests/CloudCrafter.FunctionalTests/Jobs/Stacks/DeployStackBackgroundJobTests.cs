using System.Text;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.Jobs.Stacks;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;

namespace CloudCrafter.FunctionalTests.Jobs.Stacks;

using static Testing;

public class DeployStackBackgroundJobTests : BaseTestFixture
{
    private Stack _stack;

    [SetUp]
    public async Task Setup()
    {
        // Arrange
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var environment = FakerInstances
            .EnvironmentFaker(project)
            .RuleFor(x => x.Id, environmentId)
            .Generate();

        await AddAsync(environment);

        _stack = EntityFaker.GenerateBasicAppStack(
            new EntityFaker.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                DockerNetworkName = "cloudcrafter",
                EnvironmentId = environmentId,
                StackId = stackId,
                StackServiceId = stackServiceId,
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
                ContainerHttpPort = 3000,
                SourceProvider = null,
                Volumes =
                [
                    new EntityFaker.BasicAppVolume
                    {
                        Id = environmentId,
                        Name = "My Docker Volume",
                        IsDockerVolume = true,
                        Target = "/var/lib/mysql",
                        Source = null,
                    },
                    new EntityFaker.BasicAppVolume
                    {
                        Id = stackId,
                        Name = "My Local Volume",
                        IsDockerVolume = false,
                        Target = "/var/lib/mysql",
                        Source = "/data/var/lib/mysql",
                    },
                ],
            }
        );
        await AddAsync(_stack);
    }

    [Test]
    public async Task ShouldSendProperRecipeToAgent()
    {
        // Arrange
        await RunAsDefaultUserAsync();
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");

        var deploymentEntity = FakerInstances
            .DeploymentFaker(_stack)
            .RuleFor(x => x.Id, deploymentId)
            .Generate();

        await AddAsync(deploymentEntity);

        var job = new DeployStackBackgroundJob(deploymentEntity.Id);

        // Mock dependencies
        var agentManagerMock = new Mock<IAgentManager>();
        DeploymentRecipe? capturedRecipe = null;

        // Setup mock to capture the recipe
        agentManagerMock
            .Setup(x =>
                x.SendRecipeToAgent(
                    It.IsAny<Guid>(), // Server ID might vary based on stack setup
                    deploymentEntity.Id,
                    It.IsAny<DeploymentRecipe>()
                )
            )
            .Callback<Guid, Guid, DeploymentRecipe>((_, _, recipe) => capturedRecipe = recipe)
            .Returns(Task.CompletedTask);

        // If your strategy requires ISourceProviderHelper, mock it here as well
        var sourceProviderHelperMock = new Mock<ISourceProviderHelper>();

        // Create a custom service provider for this test scope
        var services = new ServiceCollection();

        // Add necessary services from the main provider (adjust as needed)
        services.AddSingleton(GetService<ILoggerFactory>());
        services.AddSingleton(sourceProviderHelperMock.Object); // Add mocked helper

        // Add our mocked service
        services.AddSingleton(agentManagerMock.Object);

        // Build the custom provider
        var serviceProvider = services.BuildServiceProvider();

        // Set the private field _job
        var hangfireJobId = "test-hangfire-job-id";
        var backgroundJob = new BackgroundJob
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            HangfireJobId = hangfireJobId,
            Type = BackgroundJobType.StackDeployment,
            Status = BackgroundJobStatus.Created,
        };
        await AddAsync(backgroundJob); // Add to DB if HandleEntity or other parts require it

        // Get services from the custom provider
        var loggerFactory = GetService<ILoggerFactory>();

        await job.HandleEntity(GetService<IApplicationDbContext>(), hangfireJobId);
        await job.Handle(
            serviceProvider,
            GetService<IApplicationDbContext>(),
            loggerFactory,
            hangfireJobId
        );
        // Create a scope for scoped services like DbContext if needed by Handle


        // Assert
        // agentManagerMock.Verify(x => x.SendRecipeToAgent(
        //     loadedDeployment!.ServerId, // Verify correct ServerId
        //     deploymentEntity.Id,
        //     It.IsAny<DeploymentRecipe>()
        // ), Times.Once);

        capturedRecipe.Should().NotBeNull();
        //  capturedRecipe!.Name.Should().Be(loadedDeployment.Stack!.Name);
        // Add more specific assertions based on the expected recipe generated by your strategy
        // For example, check steps, environment variables, volumes etc.
        capturedRecipe!.BuildOptions.Should().NotBeNull(); // Check BuildOptions exists
        capturedRecipe.BuildOptions!.Steps.Should().NotBeEmpty();

        // Optionally, verify the deployment state and stored YAML in DB
        var finalDeployment = await FindAsync<Deployment>(deploymentEntity.Id);
        finalDeployment.Should().NotBeNull();
        finalDeployment!.State.Should().NotBe(DeploymentState.Failed);
        finalDeployment.RecipeYaml.Should().NotBeNullOrEmpty();

        var dockerCompose = capturedRecipe.DockerComposeOptions!.Base64DockerCompose;

        var base64DecodedCompose = Convert.FromBase64String(dockerCompose!);

        var decodedComposeString = Encoding.UTF8.GetString(base64DecodedCompose);
        // Add YAML content verification if needed

        await Verify(
            new
            {
                capturedRecipe,
                finalDeployment,
                decodedComposeString,
            }
        );
    }
}
