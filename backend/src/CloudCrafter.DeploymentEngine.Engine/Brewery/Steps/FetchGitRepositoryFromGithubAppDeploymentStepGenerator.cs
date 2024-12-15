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
                { "repository", options.Repository },
                { "repositoryId", options.RepositoryId },
                { "branch", options.Branch },
                { "accessToken", options.AccessToken },
            },
        };
    }

    public class Args
    {
        public required string Repository { get; init; }
        public required string Branch { get; init; }
        public required string RepositoryId { get; set; }
        public required string AccessToken { get; set; }
    }
}
