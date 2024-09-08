using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class NixpacksBuildDockerImageBuildStepGenerator(NixpacksBuildDockerImageBuildStepGenerator.Args options)
    : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Build Docker image",
            Description = "Builds the Docker image for the application",
            Type = DeploymentBuildStepType.NixpacksBuildDockerImage,
            Params = new Dictionary<string, object>
            {
                { "path", options.Path },
                { "image", options.ImageRepository },
                { "tag", options.ImageTag },
                { "disableCache", options.DisableBuildCache },
                { "env", options.BuildArgs }
            }
        };
    }

    public class Args
    {
        public required string Path { get; init; }
        public required string ImageRepository { get; init; }
        public required string ImageTag { get; init; }
        public required bool DisableBuildCache { get; init; }
        public required Dictionary<string, object> BuildArgs { get; init; }
    }
}
