using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.DockerCompose;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.RecipeGenerators;

public class SimpleAppRecipeGenerator(BaseRecipeGenerator.Args options)
    : BaseRecipeGenerator(options)
{
    public override DeploymentRecipe Generate()
    {
        var dockerComposeGenerator = new SimpleAppDockerComposeGenerator(
            new BaseDockerComposeGenerator.Args
            {
                DeploymentId = Options.DeploymentId,
                Stack = Options.Stack,
            }
        );

        var dockerComposeEditor = dockerComposeGenerator.Generate();
        // TODO: Move to some constant (and in the future a configurable option.
        // For now, it's fine.
        var dockerComposeLocation = $"/data/cloudcrafter/stacks/{Options.Stack.Id}";
        Recipe
            .SetDockerComposeOptions(dockerComposeEditor, dockerComposeLocation)
            .SetDestination(dockerComposeLocation);

        return Recipe.Build();
    }
}
