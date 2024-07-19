using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Runner;

public class DeploymentContext(DeploymentRecipe recipe, bool dryRun = false)
{
    private readonly Dictionary<string, object> _recipeResults = new();
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DeploymentRecipe Recipe { get; } = recipe;
    public bool IsDryRun { get; } = dryRun;

    public string GetWorkingDirectory()
    {
        return Recipe.Destination.RootDirectory;
    }

    public void SetRecipeResult(string stepName, object result)
    {
        _recipeResults[stepName] = result;
    }

    public T GetRecipeResult<T>(string stepName)
    {
        return (T)_recipeResults[stepName];
    }
}

public abstract class RecipeResultKeys
{
    public const string NixpacksBuildPack = nameof(NixpacksBuildPack);
    public const string NixpacksBuildPlan = nameof(NixpacksBuildPlan);
}
