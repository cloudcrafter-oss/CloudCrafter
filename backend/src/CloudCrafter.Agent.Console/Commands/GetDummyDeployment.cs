using CloudCrafter.Agent.Models.Recipe;
using MediatR;

namespace CloudCrafter.Agent.Console.Commands;

public static class GetDummyDeployment
{
    public record Query : IRequest<DeploymentRecipe>;

    private class Handler : IRequestHandler<Query, DeploymentRecipe>
    {
        public Task<DeploymentRecipe> Handle(Query request, CancellationToken cancellationToken)
        {
            var random = new Random();
            var randomString = new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
            var recipe = new DeploymentRecipe
            {
                Name = "My Application",
                Destination = new DeploymentRecipeDestination { RootDirectory = "/tmp/cloudcrafter/" + randomString },
                BuildOptions = new DeploymentBuildOptions
                {
                    Steps = new List<DeploymentBuildStep>
                    {
                        new()
                        {
                            Name = "Fetch git",
                            Description = "Fetch the git application",
                            Type = DeploymentBuildStepType.FetchGitRepository,
                            Params = new()
                            {
                                { "repo", "git@github.com:Thijmen/thijmen.dev.git"},
                                { "commit", "HEAD" }
                            }
                        },
                        new()
                        {
                            Name = "Determine Buildpack",
                            Description = "Determine the buildpack",
                            Type = DeploymentBuildStepType.NixpacksDetermineBuildPack,
                            Params = new()
                        }
                    }
                }
            };

            return Task.FromResult(recipe);
        }
    }
}
