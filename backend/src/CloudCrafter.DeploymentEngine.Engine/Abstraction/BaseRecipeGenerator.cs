using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Abstraction;

public abstract class BaseRecipeGenerator
{
    protected readonly Args Options;

    protected readonly RecipeBrewery Recipe;

    protected BaseRecipeGenerator(Args options)
    {
        Options = options;
        Recipe = new RecipeBrewery(options.Stack.Name);

        // TODO: Maybe construct this in the constructor of RecipeBrewery?
        Recipe.SetStackId(options.Stack.Id);
    }

    public abstract DeploymentRecipe Generate();

    public class Args
    {
        public required Stack Stack { get; init; }
        public required Guid DeploymentId { get; init; }
    }
}
