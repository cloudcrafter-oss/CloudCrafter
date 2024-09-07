using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.DeploymentEngine.Engine.Abstraction;

public interface IBuildStepGenerator
{
    public DeploymentBuildStep Generate();
}
