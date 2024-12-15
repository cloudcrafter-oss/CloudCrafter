using System.Reflection;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Runner.Factories;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.Agent.Runner.Tests.Models;

public class ParamsShouldExtendBaseParamsTest
{
    [Test]
    public void EnsureAllParamsExtendBaseParams()
    {
        var namespaceToCheck = "CloudCrafter.Agent.Models.Deployment.Steps.Params";
        var baseClassType = typeof(BaseParams);

        // Get all types in the assembly
        var assembly = Assembly.GetAssembly(baseClassType);

        if (assembly is null)
        {
            throw new Exception("Could not load assembly");
        }

        var parameterClasses = assembly
            .GetTypes()
            .Where(t =>
                t.Namespace != null
                && t.Namespace.StartsWith(namespaceToCheck)
                && t.IsClass
                && !t.IsAbstract
                && t.Name.EndsWith("Params") // Convention: All parameter classes end with "Params"
            );

        parameterClasses.Count().Should().BeGreaterThan(0);

        // Check each type
        foreach (var type in parameterClasses)
        {
            baseClassType
                .IsAssignableFrom(type)
                .Should()
                .BeTrue(
                    $"Parameter class {type.Name} in namespace {type.Namespace} must inherit from {baseClassType.Name}"
                );
        }
    }

    [Test]
    public void EnsureAllParamsFollowNamingConvention()
    {
        var namespaceToCheck = "CloudCrafter.Agent.Models.Deployment.Steps.Params";
        var baseClassType = typeof(BaseParams);
        var assembly = Assembly.GetAssembly(baseClassType);

        if (assembly is null)
        {
            throw new Exception("Could not load assembly");
        }

        var allTypesInNamespace = assembly
            .GetTypes()
            .Where(t =>
                t.Namespace != null
                && t.Namespace.StartsWith(namespaceToCheck)
                && t.IsClass
                && !t.IsAbstract
                && baseClassType.IsAssignableFrom(t)
            );

        foreach (var type in allTypesInNamespace)
        {
            type.Name.Should()
                .EndWith(
                    "Params",
                    $"All parameter classes must end with 'Params'. {type.Name} does not follow this convention."
                );
        }
    }
}
