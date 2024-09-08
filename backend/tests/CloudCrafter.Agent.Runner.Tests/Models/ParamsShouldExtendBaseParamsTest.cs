using System.Reflection;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using FluentAssertions;

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


        var deploymentStepClasses = assembly.GetTypes()
            .Where(t => t.Namespace != null &&
                        t.Namespace.StartsWith(namespaceToCheck) &&
                        t.IsClass &&
                        !t.IsAbstract &&
                        t.GetCustomAttributes(typeof(DeploymentStepAttribute), true).Any());

        deploymentStepClasses.Count().Should().BeGreaterThan(0);
        // Check each type
        foreach (var type in deploymentStepClasses)
        {
            Assert.IsTrue(baseClassType.IsAssignableFrom(type),
                $"DeploymentStep class {type.Name} in namespace {type.Namespace} does not inherit from {baseClassType.Name}");
        }

        // Ensure we found at least one DeploymentStep class
        Assert.IsTrue(deploymentStepClasses.Any(),
            $"No classes with [DeploymentStep] attribute found in namespace {namespaceToCheck} or its sub-namespaces");
    }
}
