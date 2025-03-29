using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class WriteEnvironmentVariablesFileToFilesystemStepGenerator(
    WriteEnvironmentVariablesFileToFilesystemStepGenerator.Args options
) : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Write environment variables file to filesystem",
            Description = "Writes the environment variables file to the filesystem",
            Type = DeploymentBuildStepType.WriteEnvironmentVariablesFileToFilesystem,
            Params = new Dictionary<string, object> { { "fileName", options.FileName } },
        };
    }

    public class Args
    {
        /// <summary>
        ///     This is the path in the repository from where the application should be build
        /// </summary>
        public required string FileName { get; init; }

        public required string FileContents { get; init; }
    }
}
