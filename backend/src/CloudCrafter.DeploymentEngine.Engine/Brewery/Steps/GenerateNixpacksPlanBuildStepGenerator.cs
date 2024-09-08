using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class GenerateNixpacksPlanBuildStepGenerator(GenerateNixpacksPlanBuildStepGenerator.Args options)
    : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Generate Nixpacks plan",
            Description = "Generates the Nixpacks plan for the application",
            Type = DeploymentBuildStepType.NixpacksGeneratePlan,
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
