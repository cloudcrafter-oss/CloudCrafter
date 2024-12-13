using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.RecipeGenerators;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;

public class NixpacksAppStrategy : BaseStrategy
{
    public override Task<BaseRecipeGenerator> GenerateRecipeAsync(
        Stack stack,
        Deployment deployment
    )
    {
        var recipeGenerator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args { Stack = stack, DeploymentId = deployment.Id }
        );

        return Task.FromResult<BaseRecipeGenerator>(recipeGenerator);
    }
}
