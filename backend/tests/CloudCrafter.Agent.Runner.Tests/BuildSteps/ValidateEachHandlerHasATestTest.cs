using System.Reflection;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Runner.Factories;
using FluentAssertions;

namespace CloudCrafter.Agent.Runner.Tests.BuildSteps;

public class ValidateEachHandlerHasATestTest
{
    [Test]
    public void EnsureAllGeneratorsHaveATest()
    {
        // Get all types in the assembly containing BaseDeploymentStep
        var baseStepType = typeof(BaseDeploymentStep<>);
        var assembly = Assembly.GetAssembly(baseStepType);
        assembly.Should().NotBeNull("Assembly containing BaseDeploymentStep should be loaded");

        // Find all non-abstract classes that inherit from BaseDeploymentStep<>
        var deploymentHandlers = assembly!
            .GetTypes()
            .Where(t =>
                t.IsClass
                && !t.IsAbstract
                && t.BaseType != null
                && t.BaseType.IsGenericType
                && t.BaseType.GetGenericTypeDefinition() == baseStepType
            )
            .ToList();

        deploymentHandlers.Should().NotBeEmpty("There should be at least one handler class");

        var testAssembly = typeof(ValidateEachHandlerHasATestTest).Assembly;

        foreach (var handler in deploymentHandlers)
        {
            // Get the generic parameter type from the handler
            var paramType = handler.BaseType!.GetGenericArguments().FirstOrDefault();
            if (paramType != null)
            {
                var testBaseType = typeof(BaseStepHandlerTest<,>).MakeGenericType(
                    handler,
                    paramType
                );
                var tests = testAssembly
                    .GetTypes()
                    .Where(t => t.IsClass && !t.IsAbstract && testBaseType.IsAssignableFrom(t))
                    .ToList();

                tests
                    .Should()
                    .NotBeEmpty(
                        $"Handler class {handler.Name} should have at least one test class that inherits from BaseStepHandlerTest<{handler.Name}, {paramType.Name}>"
                    );
            }
        }
    }
}
