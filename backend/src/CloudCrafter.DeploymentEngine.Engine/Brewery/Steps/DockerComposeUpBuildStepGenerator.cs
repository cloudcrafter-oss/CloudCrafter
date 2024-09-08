using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class DockerComposeUpBuildStepGenerator(DockerComposeUpBuildStepGenerator.Args args) : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Docker Compose Up",
            Description = "Runs docker compose up and stores the service names in a context, if enabled.",
            Type = DeploymentBuildStepType.DockerComposeUp,
            Params = new Dictionary<string, object>
            {
                { "dockerComposeFile", args.DockerComposeFile }, { "storeServiceNames", args.StoreServiceNames }
            }
        };
    }

    public class Args
    {
        public required string DockerComposeFile { get; init; }
        public required bool StoreServiceNames { get; init; }
    }
}
