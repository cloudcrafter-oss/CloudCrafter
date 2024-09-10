using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.DockerCompose;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.DockerCompose;

public class SimpleAppDockerComposeGeneratorTest
{
    [Test]
    public async Task ShouldCreateDockerComposeEditor()
    {
        // Arrange
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var stack = FakerInstances
            .StackFaker(environmentId)
            .RuleFor(x => x.Id, stackId)
            .RuleFor(x => x.Name, "My Custom Stack 123")
            .Generate();

        var stackService = FakerInstances
            .StackServiceFaker(stack)
            .RuleFor(x => x.Id, stackServiceId)
            .RuleFor(
                x => x.HttpConfiguration,
                new EntityHttpConfiguration { DomainName = "my-custom-domain.com" }
            )
            .RuleFor(x => x.Name, "My Custom Service : 123")
            .Generate();
        stack.Services.Add(stackService);

        var generator = new SimpleAppDockerComposeGenerator(
            new BaseDockerComposeGenerator.Args { Stack = stack, DeploymentId = deploymentId }
        );

        // Act
        var editor = generator.Generate();
        editor.Should().NotBeNull();

        var composeContent = editor.GetYaml();

        // Assert
        await Verify(composeContent);
    }
}
