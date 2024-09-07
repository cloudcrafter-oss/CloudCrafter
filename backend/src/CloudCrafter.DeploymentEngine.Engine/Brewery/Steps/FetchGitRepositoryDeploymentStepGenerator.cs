using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class FetchGitRepositoryDeploymentStepGenerator(FetchGitRepositoryDeploymentStepGenerator.Args options)
    : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Fetch git repository",
            Description = "Fetches the git repository",
            Type = DeploymentBuildStepType.FetchGitRepository,
            Params = new Dictionary<string, object>
            {
                { "repo", options.Repository }, { "commit", options.Commit }
            }
        };
    }

    public class Args
    {
        public required string Repository { get; init; }
        public required string Commit { get; init; }
    }
}
