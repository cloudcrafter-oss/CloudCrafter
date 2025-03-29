using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Models.IO;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.DockerCompose.Shared.Labels;
using CloudCrafter.Shared.Utils;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace CloudCrafter.Agent.Console.IntegrationTests.Deployments;

public class RollingUpdateTest : AbstractTraefikTest
{
    private DeploymentService _deploymentService;
    private IDockerHelper _dockerHelper;
    private DeploymentRecipe _firstRecipe;
    private DeploymentRecipe _secondRecipe;

    private DeploymentRecipe Create(
        Guid deploymentId,
        Guid applicationId,
        string tag,
        string dummyEnv
    )
    {
        var mainImageRepository = "rolling-update";
        var dockerComposeEditor = new DockerComposeEditor();

        var network = dockerComposeEditor
            .AddNetwork("cloudcrafter")
            .SetNetworkName("cloudcrafter")
            .SetIsExternalNetwork();

        var service = dockerComposeEditor.AddService($"frontend-{tag}");
        service.SetImage(mainImageRepository, tag);
        service.AddNetwork(network);

        var labelService = new DockerComposeLabelService();
        labelService.AddLabel(LabelFactory.GenerateStackLabel(applicationId));
        labelService.AddLabel(LabelFactory.GenerateDeploymentLabel(deploymentId));
        labelService.AddLabel(LabelFactory.GenerateManagedLabel());
        labelService.AddTraefikLabels(
            new DockerComposeLabelServiceTraefikOptions
            {
                AppName = "frontend",
                Rule = "Host(`frontend-rolling.127.0.0.1.sslip.io`)",
                Service = "frontend",
                LoadBalancerPort = 3000,
            }
        );

        service.SetEnvironmentFilename(".env");
        service.AddLabels(labelService);

        var dockerComposeBase64 = dockerComposeEditor.ToBase64();
        var randomString = RandomGenerator.String();

        var recipe = new DeploymentRecipe
        {
            Name = "My Application",
            Application = new DeploymentRecipeApplicationInfo { Id = applicationId },
            Destination = new DeploymentRecipeDestination
            {
                RootDirectory = "/tmp/cloudcrafter/" + randomString,
                GitCheckoutDirectory = "/tmp/tmp-" + RandomGenerator.String(),
            },
            DockerComposeOptions = new DeploymentRecipeDockerComposeOptions
            {
                Base64DockerCompose = dockerComposeBase64,
                // In production envs, this will have the application stack guid in it
                DockerComposeDirectory = "/tmp/cloudcrafter-data/my-application",
            },
            BuildOptions = new DeploymentBuildOptions
            {
                Steps = new List<DeploymentBuildStep>
                {
                    new NetworkExistsDeploymentStepGenerator("cloudcrafter").Generate(),
                    new FetchGitRepositoryDeploymentStepGenerator(
                        new()
                        {
                            Repository = "https://github.com/cloudcrafter-oss/demo-examples.git",
                            Commit = "HEAD",
                        }
                    ).Generate(),
                    new DetermineNixpacksBuildpackBuildStepGenerator(
                        new() { Path = "nixpacks-node-server" }
                    ).Generate(),
                    new GenerateNixpacksPlanBuildStepGenerator(
                        new() { Path = "nixpacks-node-server" }
                    ).Generate(),
                    new AlterNixpacksBuildPlanBuildStepGenerator(
                        new() { AddPackages = ["iputils-ping"] }
                    ).Generate(),
                    new WriteEnvironmentVariablesFileToFilesystemStepGenerator(
                        new() { FileName = ".env", FileContents = $"DUMMY_ENV_VAR={dummyEnv}" }
                    ).Generate(),
                    new NixpacksWritePlanToFsBuildStepGenerator(
                        new() { Path = "nixpxacks-node-server" }
                    ).Generate(),
                    new NixpacksBuildDockerImageBuildStepGenerator(
                        new()
                        {
                            Path = "nixpacks-node-server",
                            ImageRepository = mainImageRepository,
                            ImageTag = tag,
                            DisableBuildCache = true,
                            BuildArgs = new Dictionary<string, object>
                            {
                                { "BUILD_MOMENT", DateTime.UtcNow.ToString("F") },
                            },
                        }
                    ).Generate(),
                    new WriteDockerComposeBuildStepGenerator(
                        new() { DockerComposeFileName = "docker-compose.yml" }
                    ).Generate(),
                    new DockerComposeUpBuildStepGenerator(
                        new() { DockerComposeFile = "docker-compose.yml", StoreServiceNames = true }
                    ).Generate(),
                    new ContainerHealthCheckDeploymentStepGenerator(
                        new()
                        {
                            DockerComposeSettings = new() { FetchServicesFromContext = true },
                            Services = new Dictionary<
                                string,
                                ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
                            >()
                            {
                                {
                                    $"frontend-{tag}",
                                    new()
                                    {
                                        HttpMethod = "get",
                                        HttpSchema = "http",
                                        HttpHost = "localhost",
                                        HttpPath = "/",
                                        HttpPort = 3000,
                                        ExpectedHttpStatusCode = 200,
                                        MaxRetries = 4,
                                        CheckForDockerHealth = null,
                                    }
                                },
                            },
                        }
                    ).Generate(),
                },
            },
        };

        var recipeWriter = new YamlRecipeWriter(recipe);

        var recipeAsString = recipeWriter.WriteString();

        var recipeReader = new YamlRecipeReader();

        var readRecipe = recipeReader.FromString(recipeAsString);

        return readRecipe;
    }

    [TearDown]
    public async Task StopCreatedContainers()
    {
        var containers = await _dockerHelper.GetContainersFromFilter(
            new DockerContainerFilter { OnlyCloudCrafterLabels = true }
        );

        foreach (var container in containers)
        {
            await _dockerHelper.StopContainers([container.ID]);
            await _dockerHelper.RemoveContainers([container.ID]);
        }
    }

    [SetUp]
    public void SetUp()
    {
        var applicationId = Guid.NewGuid();

        var firstDeploymentId = Guid.NewGuid();
        var secondDeploymentId = Guid.NewGuid();

        var time = DateTime.UtcNow.Millisecond;
        var firstTag = $"{time}-v1";
        var secondTag = $"{time}-v2";

        _firstRecipe = Create(firstDeploymentId, applicationId, firstTag, "firstTag");
        _secondRecipe = Create(secondDeploymentId, applicationId, secondTag, "secondTag");

        _secondRecipe.BuildOptions.Steps.Add(
            new DeploymentBuildStep
            {
                Name = "Stop previous containers for rolling restart",
                Description = "Stop previous containers for rolling restart",
                Type = DeploymentBuildStepType.StopContainers,
                Params = new Dictionary<string, object>
                {
                    {
                        "filters",
                        new Dictionary<string, object>
                        {
                            {
                                "labels",
                                new List<string>
                                {
                                    $"cloudcrafter.stack.id={applicationId}",
                                    $"cloudcrafter.deployment!={secondDeploymentId}",
                                }
                            },
                        }
                    },
                    { "onlyCloudCrafterContainers", true },
                },
            }
        );

        var builder = Program.CreateHostBuilder([]);
        var host = builder.Build();
        Log.Logger = new LoggerConfiguration().WriteTo.NUnitOutput().CreateLogger();

        _deploymentService = host.Services.GetRequiredService<DeploymentService>();
        _dockerHelper = host.Services.GetRequiredService<IDockerHelper>();
    }

    [Test]
    public async Task ShouldBeAbleToDeployRollingUpdate()
    {
        await EnsureNetworkExists("cloudcrafter");
        await _deploymentService.ValidateRecipe(_firstRecipe);
        await _deploymentService.ValidateRecipe(_secondRecipe);

        await _deploymentService.DeployAsync(_firstRecipe);

        await ShouldHaveEndpointResponse(
            "http://frontend-rolling.127.0.0.1.sslip.io:8888/env",
            "DUMMY_ENV_VAR: firstTag"
        );

        await _deploymentService.DeployAsync(_secondRecipe);
        await ShouldHaveEndpointResponse(
            "http://frontend-rolling.127.0.0.1.sslip.io:8888/env",
            "DUMMY_ENV_VAR: secondTag"
        );
    }
}
