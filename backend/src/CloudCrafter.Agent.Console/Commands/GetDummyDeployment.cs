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
                Destination =
                    new DeploymentRecipeDestination { RootDirectory = "/tmp/cloudcrafter/" + randomString },
                BuildOptions = new DeploymentBuildOptions
                {
                    Steps = new List<DeploymentBuildStep>
                    {
                        new()
                        {
                            Name = "Fetch git",
                            Description = "Fetch the git application",
                            Type = DeploymentBuildStepType.FetchGitRepository,
                            Params =
                                new Dictionary<string, object>
                                {
                                    { "repo", "https://github.com/cloudcrafter-oss/demo-examples.git" },
                                    { "commit", "HEAD" }
                                }
                        },
                        new()
                        {
                            Name = "Determine Buildpack",
                            Description = "Determine the buildpack",
                            Type = DeploymentBuildStepType.NixpacksDetermineBuildPack,
                            Params = new Dictionary<string, object> { { "path", "nixpacks-node-server" } }
                        },
                        new()
                        {
                            Name = "Generate Build plan",
                            Description = "Generate the build plan",
                            Type = DeploymentBuildStepType.NixpacksGeneratePlan,
                            Params = new Dictionary<string, object> { { "path", "nixpacks-node-server" } }
                        },
                        new()
                        {
                            Name = "Alter plan",
                            Description = "Alter plan",
                            Type = DeploymentBuildStepType.NixpacksAlterPlan,
                            Params =
                                new Dictionary<string, object>() { { "packages", new List<string> { "iputils-ping" } } }
                        },
                        new()
                        {
                            Name = "Write plan to filesystem",
                            Description = "Write plan to filesystem",
                            Type = DeploymentBuildStepType.NixpacksWritePlanToFileSystem,
                            Params = new() { { "path", "nixpacks-node-server" } }
                        },
                        new()
                        {
                            Name = "Build Nixpacks docker image",
                            Description = "Builds Nixpacks docker image",
                            Type = DeploymentBuildStepType.NixpacksBuildDockerImage,
                            Params = new()
                            {
                                { "path", "nixpacks-node-server" },
                                { "image", "custom-image" },
                                { "tag", randomString }
                            }
                        }
                    }
                }
            };

            return Task.FromResult(recipe);
        }
    }
}
