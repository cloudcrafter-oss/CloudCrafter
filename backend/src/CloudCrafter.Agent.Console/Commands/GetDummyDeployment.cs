using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.Shared.Utils;
using MediatR;

namespace CloudCrafter.Agent.Console.Commands;

public static class GetDummyDeployment
{
    public record Query(string ImageRepository, string ImageTag) : IRequest<DeploymentRecipe>;

    private class Handler : IRequestHandler<Query, DeploymentRecipe>
    {
        public Task<DeploymentRecipe> Handle(Query request, CancellationToken cancellationToken)
        {
            var imageRepository = request.ImageRepository;
            var imageTag = request.ImageTag;

            var dockerComposeEditor = new DockerComposeEditor();

            var service = dockerComposeEditor.AddService("frontend");
            service.SetImage(imageRepository, imageTag);
            service.AddExposedPort(3000, 3000);

            var dockerComposeBase64 = dockerComposeEditor.ToBase64();


            var recipe = new DeploymentRecipe
            {
                Name = "My Application",
                Destination =
                    new DeploymentRecipeDestination { RootDirectory = "/tmp/cloudcrafter/" + imageTag },
                DockerComposeOptions =
                    new DeploymentRecipeDockerComposeOptions { Base64DockerCompose = dockerComposeBase64 },
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
                                new Dictionary<string, object> { { "packages", new List<string> { "iputils-ping" } } }
                        },
                        new()
                        {
                            Name = "Write plan to filesystem",
                            Description = "Write plan to filesystem",
                            Type = DeploymentBuildStepType.NixpacksWritePlanToFileSystem,
                            Params = new Dictionary<string, object> { { "path", "nixpacks-node-server" } }
                        },
                        new()
                        {
                            Name = "Build Nixpacks docker image",
                            Description = "Builds Nixpacks docker image",
                            Type = DeploymentBuildStepType.NixpacksBuildDockerImage,
                            Params = new Dictionary<string, object>
                            {
                                { "path", "nixpacks-node-server" },
                                { "image", imageRepository },
                                { "tag", imageTag },
                                { "disableCache", true }
                            }
                        }
                    }
                }
            };

            return Task.FromResult(recipe);
        }
    }
}
