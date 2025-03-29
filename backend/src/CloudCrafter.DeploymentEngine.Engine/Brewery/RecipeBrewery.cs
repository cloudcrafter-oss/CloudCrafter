using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DockerCompose.Engine.Yaml;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery;

public class RecipeBrewery(string Name)
{
    private readonly List<DeploymentBuildStep> _buildSteps = new();

    private DeploymentRecipeApplicationInfo? _application;
    private DeploymentRecipeDestination? _destination;
    private DeploymentRecipeDockerComposeOptions? _dockerComposeOptions;

    public RecipeBrewery SetStackId(Guid id)
    {
        _application = new DeploymentRecipeApplicationInfo { Id = id };
        return this;
    }

    public RecipeBrewery SetDockerComposeOptions(
        DockerComposeEditor dockerComposeEditor,
        string? dockerComposeDirectory
    )
    {
        _dockerComposeOptions = new DeploymentRecipeDockerComposeOptions
        {
            Base64DockerCompose = dockerComposeEditor.ToBase64(),
            DockerComposeDirectory = dockerComposeDirectory,
        };
        return this;
    }

    public RecipeBrewery SetDestination(string rootDirectory, string gitDirectory)
    {
        _destination = new DeploymentRecipeDestination
        {
            RootDirectory = rootDirectory,
            GitCheckoutDirectory = gitDirectory,
        };
        return this;
    }

    public RecipeBrewery AddBuildStep(IBuildStepGenerator generator)
    {
        _buildSteps.Add(generator.Generate());
        return this;
    }

    public DeploymentRecipe Build()
    {
        if (_application == null)
        {
            throw new InvalidOperationException("Application must be set.");
        }

        if (_destination == null)
        {
            throw new InvalidOperationException("Destination must be set.");
        }

        return new DeploymentRecipe
        {
            Name = Name,
            Application = _application,
            DockerComposeOptions = _dockerComposeOptions,
            Destination = _destination,
            BuildOptions = new DeploymentBuildOptions { Steps = _buildSteps },
        };
    }
}
