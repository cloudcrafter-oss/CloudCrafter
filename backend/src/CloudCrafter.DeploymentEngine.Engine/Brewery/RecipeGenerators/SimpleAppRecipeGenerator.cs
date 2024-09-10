using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.DockerCompose;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.RecipeGenerators;

public class SimpleAppRecipeGenerator(BaseRecipeGenerator.Args options)
    : BaseRecipeGenerator(options)
{
    public override BaseDockerComposeGenerator CreateDockerComposeGenerator()
    {
        return new SimpleAppDockerComposeGenerator(
            new BaseDockerComposeGenerator.Args
            {
                Stack = Options.Stack,
                DeploymentId = Options.DeploymentId,
            }
        );
    }

    public override DeploymentRecipe Generate()
    {
        var dockerComposeEditor = GenerateDockerCompose();

        // TODO: Move to some constant (and in the future a configurable option.
        // For now, it's fine.
        var dockerComposeLocation = $"/data/cloudcrafter/stacks/{Options.Stack.Id}";
        Recipe
            .SetDockerComposeOptions(dockerComposeEditor, dockerComposeLocation)
            .SetDestination(dockerComposeLocation);

        AddSteps();

        return Recipe.Build();
    }

    private void AddSteps()
    {
        AddNetworkExistsStep("cloudcrafter");

        if (!string.IsNullOrWhiteSpace(Options.Stack.Source?.Git?.Repository))
        {
            // TODO: It should never be possible that it is null or empty in this case.
            // Maybe we should throw an exception if it happens.
            AddFetchGitRepositoryStep(
                Options.Stack.Source.Git.Repository,
                "HEAD" // TODO: change
            );
        }

        AddDetermineBuildpackStep(Options.Stack.Source?.Git?.Path);
        AddGenerateBuildPlan(Options.Stack.Source?.Git?.Path);
        AlterNixpacksPlan(["iputils-ping", "curl"]);
        AddWritePlanToFilesystemStep(Options.Stack.Source?.Git?.Path);
    }
}
