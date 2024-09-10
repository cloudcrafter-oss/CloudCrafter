﻿using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.RecipeGenerators;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.RecipeGenerators;

public class SimpleAppRecipeGeneratorTest
{
    [Test]
    public Task ShouldBeAbleToGenerateRecipeForSimpleApp()
    {
        // Arrange
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var stack = Helper.GenerateBasicAppStack(
            new Helper.GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = environmentId,
                StackId = stackId,
                StackServiceId = stackServiceId,
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
            }
        );

        var generator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args { Stack = stack, DeploymentId = deploymentId }
        );

        // Act
        var result = generator.Generate();

        var writer = new YamlRecipeWriter(result);
        var recipe = writer.WriteString();

        // Assert
        return Verify(recipe);
    }
}