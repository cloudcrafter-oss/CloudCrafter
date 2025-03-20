using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class FetchGitRepositoryFromGithubAppDeploymentStepGenerator(
    FetchGitRepositoryFromGithubAppDeploymentStepGenerator.Args options
) : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Fetch git repository from source provider",
            Description = "Fetches the git repository from source provider",
            Type = DeploymentBuildStepType.FetchGitRepositoryFromProvider,
            Params = new Dictionary<string, object>
            {
                { "fullPathWithToken", options.FullPathWithToken },
                { "providerPath", options.ProviderPath },
                { "branch", options.Branch },
                { "path", options.Path },
            },
        };
    }

    public class Args
    {
        public required string FullPathWithToken { get; init; }
        public required string ProviderPath { get; set; }
        public required string Path { get; set; }
        public required string Branch { get; set; }
    }
}
