using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Core.Jobs.Stacks;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.E2E.Deployments.Scenarios;

using static Testing;

public class SimpleAppDeploymentTest : BaseTestFixture
{
    private Stack Stack { get; set; }

    public Guid StackServiceId { get; set; }

    public Guid StackId { get; set; }

    public Guid EnvironmentId { get; set; }

    [SetUp]
    public void SetUp()
    {
        EnvironmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        StackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        StackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        Stack = EntityFaker.GenerateBasicAppStack(
            new EntityFaker.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = EnvironmentId,
                StackId = StackId,
                StackServiceId = StackServiceId,
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123"
            }
        );
    }

    private class TestConfig
    {
        
    }

    private async Task<TestConfig> EnsureConfigCreated()
    {
        (await CountAsync<Stack>()).Should().Be(0);
        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var environment = FakerInstances
            .EnvironmentFaker(project)
            .RuleFor(x => x.Id, EnvironmentId)
            .Generate();
        var deployment = new Deployment
        {
            Id = Guid.NewGuid(),
            StackId = Stack.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Logs = new List<DeploymentLog>()
        };
        await AddAsync(environment);
        await AddAsync(Stack);
        await AddAsync(deployment);
        await RunAsAdministratorAsync();
        
        return new()
        {
            
        }
    }

    [Test]
    public async Task ShouldBeAbleToDispatchJob()
    {
       

        var job = new DeployStackBackgroundJob(deployment.Id);

        // Act
        var dispatcher = GetService<ICloudCrafterDispatcher>();
    }
}
