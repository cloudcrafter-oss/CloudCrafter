using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Runner;

public class DeploymentContext(DeploymentRecipe recipe)
{
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DeploymentRecipe Recipe { get; } = recipe;

    public string GetWorkingDirectory()
    {
        return Recipe.Destination.RootDirectory;
    }
}
