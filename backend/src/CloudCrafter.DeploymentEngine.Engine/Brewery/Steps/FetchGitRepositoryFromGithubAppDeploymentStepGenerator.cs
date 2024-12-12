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
                { "repo", options.Repository },
                { "branch", options.Branch },
            },
        };
    }

    public class Args
    {
        public required string Repository { get; init; }
        public required string Branch { get; init; }
    }
}
