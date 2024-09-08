using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery;

public class RecipeBrewery(string Name)
{
    private readonly List<DeploymentBuildStep> _buildSteps = new();
    private readonly Dictionary<string, DeploymentRecipeEnvironmentVariable> _environmentVariables = new();

    private DeploymentRecipeApplicationInfo? _application;
    private DeploymentRecipeDestination? _destination;
    private DeploymentRecipeDockerComposeOptions? _dockerComposeOptions;


    public RecipeBrewery SetApplication(Guid id)
    {
        _application = new DeploymentRecipeApplicationInfo { Id = id };
        return this;
    }

    public RecipeBrewery SetDockerComposeOptions(string? base64DockerCompose, string? dockerComposeDirectory)
    {
        _dockerComposeOptions = new DeploymentRecipeDockerComposeOptions
        {
            Base64DockerCompose = base64DockerCompose, DockerComposeDirectory = dockerComposeDirectory
        };
        return this;
    }

    public RecipeBrewery SetDestination(string rootDirectory)
    {
        _destination = new DeploymentRecipeDestination { RootDirectory = rootDirectory };
        return this;
    }

    public RecipeBrewery AddEnvironmentVariable(string name, string value, bool isBuildVariable, bool isRuntimeVariable)
    {
        _environmentVariables[name] = new DeploymentRecipeEnvironmentVariable
        {
            Name = name, Value = value, IsBuildVariable = isBuildVariable, IsRuntimeVariable = isRuntimeVariable
        };
        return this;
    }

    public RecipeBrewery AddBuildStep(string name, string description, DeploymentBuildStepType type,
        Dictionary<string, object> parameters)
    {
        _buildSteps.Add(new DeploymentBuildStep
        {
            Name = name, Description = description, Type = type, Params = parameters
        });
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
            EnvironmentVariables =
                new DeploymentRecipeEnvironmentVariableConfig { Variables = _environmentVariables },
            BuildOptions = new DeploymentBuildOptions { Steps = _buildSteps }
        };
    }
}
