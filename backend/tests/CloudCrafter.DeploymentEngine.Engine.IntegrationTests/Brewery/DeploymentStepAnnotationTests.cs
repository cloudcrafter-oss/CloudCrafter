using System.Reflection;
using CloudCrafter.Agent.Console;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery;

public class DeploymentStepAnnotationTests
{
    [Test]
    public void EnsureAllDeploymentStepClassesHaveTests()
    {
        // Get all types in the assembly containing BaseParams
        var baseParamsType = typeof(BaseParams);
        var assembly = Assembly.GetAssembly(baseParamsType);
        assembly.Should().NotBeNull("Assembly containing BaseParams should be loaded");

        // Find all non-abstract classes that inherit from BaseParams
        var paramClasses = assembly!
            .GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && baseParamsType.IsAssignableFrom(t))
            .ToList();

        paramClasses.Should().NotBeEmpty("There should be at least one parameter class");

        // Get the assembly containing BaseDeploymentStep
        var deploymentStepAssembly = typeof(BaseDeploymentStep<>).Assembly;
        var testAssembly = typeof(BaseParameterConversionTest<>).Assembly;

        foreach (var paramClass in paramClasses)
        {
            // Check for handler (BaseDeploymentStep implementation)
            var handlerType = typeof(BaseDeploymentStep<>).MakeGenericType(paramClass);
            var handlers = deploymentStepAssembly
                .GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract && handlerType.IsAssignableFrom(t))
                .ToList();

            handlers
                .Should()
                .NotBeEmpty(
                    $"Parameter class {paramClass.Name} should have at least one handler that inherits from BaseDeploymentStep<{paramClass.Name}>"
                );
            handlers.Count.Should().Be(1);
            // Check for test class (BaseParameterConversionTest implementation)
            var testBaseType = typeof(BaseParameterConversionTest<>).MakeGenericType(paramClass);
            var tests = testAssembly
                .GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract && testBaseType.IsAssignableFrom(t))
                .ToList();

            tests
                .Should()
                .NotBeEmpty(
                    $"Parameter class {paramClass.Name} should have at least one test class that inherits from BaseParameterConversionTest<{paramClass.Name}>"
                );
        }
    }

    [Test]
    public void EnsureThatEachDeploymentBuildStepTypeHasAHandler()
    {
        var builder = Program.CreateHostBuilder([]);
        var host = builder.Build();

        var deploymentSteps = host.Services.GetServices<IDeploymentStep>();
        // Get all enum values from DeploymentBuildStepType
        var stepTypes = Enum.GetValues<DeploymentBuildStepType>();
        stepTypes.Should().NotBeEmpty("There should be at least one deployment step type");

        // For each step type, ensure there is a handler
        foreach (var stepType in stepTypes)
        {
            var handlers = deploymentSteps.Where(x => x.Type == stepType).ToList();

            handlers
                .Should()
                .NotBeEmpty(
                    $"Step type {stepType} should have at least one handler that implements IDeploymentStep"
                );
            handlers.Count.Should().Be(1, $"Step type {stepType} should have exactly one handler");
        }
    }
}
