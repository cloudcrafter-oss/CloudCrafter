using System.Reflection;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery;

public class DeploymentStepAnnotationTests
{
    private static IEnumerable<string> GetClassesWithDeploymentStepAnnotation()
    {
        var namespaceToCheck = "CloudCrafter.Agent.Models.Deployment.Steps.Params";
        var baseClassType = typeof(BaseParams);

        // Get all types in the assembly
        var assembly = Assembly.GetAssembly(baseClassType);

        if (assembly is null)
        {
            throw new Exception("Could not load assembly");
        }


        var deploymentStepClasses = assembly.GetTypes()
            .Where(t => t.Namespace != null &&
                        t.Namespace.StartsWith(namespaceToCheck) &&
                        t.IsClass &&
                        !t.IsAbstract &&
                        t.GetCustomAttributes(typeof(DeploymentStepAttribute), true).Any());

        return deploymentStepClasses.Select(t => t.FullName!);
    }

    [Test]
    public void EnsureAllDeploymentStepClassesHaveTests()
    {
        var baseParamsAssembly = typeof(BaseParams).Assembly;

        var classesWithAnnotation = GetClassesWithDeploymentStepAnnotation().ToList();
        var testClasses = Assembly.GetExecutingAssembly()
            .GetTypes()
            .Where(t => t.BaseType != null && t.BaseType.IsGenericType &&
                        t.BaseType.GetGenericTypeDefinition() == typeof(BaseParameterConversionTest<>))
            .ToList();

        var missingTests = new List<string>();

        foreach (var className in classesWithAnnotation)
        {
            var type = baseParamsAssembly.GetType(className);
            if (type == null)
            {
                missingTests.Add($"{className} (Type not found)");
                continue;
            }

            var hasMatchingTestClass = testClasses.Any(t =>
                t.BaseType != null &&
                t.BaseType.IsGenericType &&
                t.BaseType.GetGenericArguments().FirstOrDefault() == type);

            if (!hasMatchingTestClass)
            {
                missingTests.Add(type.Name);
            }
        }

        missingTests.Should()
            .BeEmpty(
                $"All classes with DeploymentStepAttribute should have a corresponding test class extending BaseParameterConversionTest<>. Missing tests for: {string.Join(", ", missingTests)}");
        classesWithAnnotation.Count().Should().Be(testClasses.Count());
    }
}
