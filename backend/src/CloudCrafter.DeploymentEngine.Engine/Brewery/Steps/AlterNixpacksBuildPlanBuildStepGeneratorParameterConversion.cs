using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class AlterNixpacksBuildPlanBuildStepGeneratorParameterConversion(AlterNixpacksBuildPlanBuildStepGeneratorParameterConversion.Args options)
    : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Alter Nixpacks build plan",
            Description = "Alters the Nixpacks build plan for the application",
            Type = DeploymentBuildStepType.NixpacksAlterPlan,
            Params = new Dictionary<string, object> { { "packages", options.AddPackages } }
        };
    }

    public class Args
    {
        public required List<string> AddPackages { get; init; }
    }
}
