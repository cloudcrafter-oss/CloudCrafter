using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps;

[AttributeUsage(AttributeTargets.Class)]
public class DeploymentStepAttribute(DeploymentBuildStepType stepType) : Attribute
{
    public DeploymentBuildStepType StepType { get; } = stepType;
}
