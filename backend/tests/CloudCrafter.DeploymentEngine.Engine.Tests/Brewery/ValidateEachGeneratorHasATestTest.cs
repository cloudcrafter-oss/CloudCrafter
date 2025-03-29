using System.Reflection;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery;

public class ValidateEachGeneratorHasATestTest
{
    [Test]
    public void EnsureAllGeneratorsHaveATest()
    {
        // Get all types in the assembly containing BaseParams
        var buildStepGeneratorType = typeof(IBuildStepGenerator);
        var assembly = Assembly.GetAssembly(buildStepGeneratorType);
        assembly.Should().NotBeNull("Assembly containing IBuildStepGenerator should be loaded");

        // Find all non-abstract classes that inherit from BaseParams
        var generatorClasses = assembly!
            .GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && buildStepGeneratorType.IsAssignableFrom(t))
            .ToList();

        generatorClasses.Should().NotBeEmpty("There should be at least one parameter class");

        var testAssembly = typeof(ValidateEachGeneratorHasATestTest).Assembly;

        foreach (var generator in generatorClasses)
        {
            //Check for test class (BaseParameterConversionTest implementation)
            var testBaseType = typeof(StepBaseTest<>).MakeGenericType(generator);
            var tests = testAssembly
                .GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract && testBaseType.IsAssignableFrom(t))
                .ToList();

            tests
                .Should()
                .NotBeEmpty(
                    $"Generator class {generator.Name} should have at least one test class that inherits from StepBaseTest<{generator.Name}>"
                );
        }
    }
}
