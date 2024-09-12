using CloudCrafter.Domain.Entities;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.E2E.Deployments.Scenarios;

public class SimpleAppDeploymentTest
{
    private Stack Stack { get; set; }

    [SetUp]
    public void SetUp()
    {
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        Stack = EntityFaker.GenerateBasicAppStack(
            new EntityFaker.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = environmentId,
                StackId = stackId,
                StackServiceId = stackServiceId,
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
            }
        );
    }

    [Test]
    public void ShouldTest()
    {
        true.Should().BeTrue();
    }
}
