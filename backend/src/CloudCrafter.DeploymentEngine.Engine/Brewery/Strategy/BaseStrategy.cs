using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;

public abstract class BaseStrategy
{
    public abstract Task<BaseRecipeGenerator> GenerateRecipeAsync(
        Stack stack,
        Deployment deployment
    );
}
