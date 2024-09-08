using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class DetermineNixpacksBuildpackBuildStepGenerator(DetermineNixpacksBuildpackBuildStepGenerator.Args options)
    : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Determine Nixpacks buildpack",
            Description = "Determines the Nixpacks buildpack to use for the application",
            Type = DeploymentBuildStepType.NixpacksDetermineBuildPack,
            Params = new Dictionary<string, object> { { "path", options.Path } }
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
