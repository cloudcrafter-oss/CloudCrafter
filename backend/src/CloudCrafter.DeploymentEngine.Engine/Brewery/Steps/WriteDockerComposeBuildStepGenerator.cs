using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class WriteDockerComposeBuildStepGenerator(WriteDockerComposeBuildStepGenerator.Args options)
    : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Write Docker Compose",
            Description = "Writes the Docker Compose file to the filesystem",
            Type = DeploymentBuildStepType.DockerComposeWriteToFileSystem,
            Params = new Dictionary<string, object> { { "dockerComposeFile", options.DockerComposeFileName } }
        };
    }

    public class Args
    {
        public required string DockerComposeFileName { get; init; }
    }
}
