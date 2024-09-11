using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class NixpacksWritePlanToFsBuildStepGenerator(
    NixpacksWritePlanToFsBuildStepGenerator.Args options
) : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Write Nixpacks plan to filesystem",
            Description = "Writes the Nixpacks plan to the filesystem",
            Type = DeploymentBuildStepType.NixpacksWritePlanToFileSystem,
            Params = new Dictionary<string, object> { { "path", options.Path } },
        };
    }

    public class Args
    {
        /// <summary>
        ///     This is the path in the repository from where the application should be build
        /// </summary>
        public required string Path { get; init; }
    }
}
