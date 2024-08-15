using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.DockerCompose.Shared.Labels;
using CloudCrafter.Shared.Utils;
using MediatR;

namespace CloudCrafter.Agent.Runner.Commands;

public static class GetMostBasicRecipe
{
    public record Query : IRequest<DeploymentRecipe>;

    private class Handler : IRequestHandler<Query, DeploymentRecipe>
    {
        public Task<DeploymentRecipe> Handle(Query request, CancellationToken cancellationToken)
        {
            var dockerComposeEditor = new DockerComposeEditor();
            var nginxService = dockerComposeEditor.AddService("nginx");
            nginxService.SetImage("nginx", "latest");
            nginxService.AddExposedPort(80, 80);

            var labelService = new DockerComposeLabelService();
            labelService.AddLabel(LabelFactory.GenerateManagedLabel());

            var randomString = RandomGenerator.String();

            var dockerComposeBase64 = dockerComposeEditor.ToBase64();

            var recipe = new DeploymentRecipe
            {
                Name = "Most basic recipe",
                Application = new DeploymentRecipeApplicationInfo { Id = Guid.NewGuid() },
                EnvironmentVariables =
                    new DeploymentRecipeEnvironmentVariableConfig
                    {
                        Variables = new Dictionary<string, DeploymentRecipeEnvironmentVariable>()
                    },
                Destination = new DeploymentRecipeDestination { RootDirectory = "/tmp/cloudcrafter" },
                DockerComposeOptions =
                    new DeploymentRecipeDockerComposeOptions
                    {
                        Base64DockerCompose = dockerComposeBase64, DockerComposeDirectory = "/tmp/cloudcrafter"
                    },
                BuildOptions = new DeploymentBuildOptions
                {
                    Steps = new List<DeploymentBuildStep>
                    {
                        new()
                        {
                            Name = "Dummy",
                            Description = "Some dummy description",
                            Type = DeploymentBuildStepType.RunPlainCommand,
                            Params = new Dictionary<string, object>
                            {
                                { "command", "echo 'Hello, World!'" }, { "allowFailure", false }
                            }
                        }
                    }
                }
            };

            return Task.FromResult(recipe);
        }
    }
}
