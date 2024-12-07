using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy.Factory;

public class DeploymentStrategyFactory
{
    public BaseStrategy CreateStrategy(Stack stack)
    {
        return stack.BuildPack switch
        {
            StackBuildPack.Nixpacks => new NixpacksAppStrategy(),
            _ => throw new NotImplementedException(),
        };
    }
}
