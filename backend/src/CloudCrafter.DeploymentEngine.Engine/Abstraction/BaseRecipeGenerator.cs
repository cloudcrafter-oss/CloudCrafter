using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using CloudCrafter.DockerCompose.Engine.Yaml;
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

    protected DockerComposeEditor GenerateDockerCompose()
    {
        var dockerComposeGenerator = CreateDockerComposeGenerator();
        dockerComposeGenerator.ValidateGenerator();

        return dockerComposeGenerator.Generate();
    }

    // TODO: Extract to some other base class? Dont know if this would be the best place for this.
    // Fine for now.
    protected void AddNetworkExistsStep(string networkName)
    {
        var generator = new NetworkExistsDeploymentStepGenerator(networkName);
        Recipe.AddBuildStep(generator);
    }

    protected void AddDetermineBuildpackStep(string? pathInGitRepo)
    {
        var generator = new DetermineNixpacksBuildpackBuildStepGenerator(
            new DetermineNixpacksBuildpackBuildStepGenerator.Args
            {
                Path = pathInGitRepo ?? string.Empty,
            }
        );

        Recipe.AddBuildStep(generator);
    }

    protected void AddGenerateBuildPlan(string? pathInGitRepo)
    {
        var generator = new GenerateNixpacksPlanBuildStepGenerator(
            new GenerateNixpacksPlanBuildStepGenerator.Args { Path = pathInGitRepo ?? string.Empty }
        );

        Recipe.AddBuildStep(generator);
    }

    protected void AlterNixpacksPlan(List<string> packagesToAdd)
    {
        var generator = new AlterNixpacksBuildPlanBuildStepGenerator(
            new AlterNixpacksBuildPlanBuildStepGenerator.Args { AddPackages = packagesToAdd }
        );

        Recipe.AddBuildStep(generator);
    }

    protected void AddWritePlanToFilesystemStep(string? pathInGitRepo)
    {
        var generator = new NixpacksWritePlanToFsBuildStepGenerator(
            new NixpacksWritePlanToFsBuildStepGenerator.Args
            {
                Path = pathInGitRepo ?? string.Empty,
            }
        );

        Recipe.AddBuildStep(generator);
    }

    protected void AddBuildNixpacksDockerImageStep() { }

    protected void AddFetchGitRepositoryStep(string repositoryUrl, string commit)
    {
        var generator = new FetchGitRepositoryDeploymentStepGenerator(
            new FetchGitRepositoryDeploymentStepGenerator.Args
            {
                Repository = repositoryUrl,
                Commit = commit,
            }
        );
        Recipe.AddBuildStep(generator);
    }

    public abstract BaseDockerComposeGenerator CreateDockerComposeGenerator();

    public abstract DeploymentRecipe Generate();

    public class Args
    {
        public required Stack Stack { get; init; }
        public required Guid DeploymentId { get; init; }
    }
}
