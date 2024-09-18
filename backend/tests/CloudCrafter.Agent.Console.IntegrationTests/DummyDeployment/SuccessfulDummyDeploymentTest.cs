using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Models.IO;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.Commands;
using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.Shared.Utils;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace CloudCrafter.Agent.Console.IntegrationTests.DummyDeployment;

public class SuccessfulDummyDeploymentTest
{
    private DeploymentService _deploymentService;
    private DeploymentRecipe _recipe;
    private IDockerHelper _dockerHelper;

    [SetUp]
    public async Task SetUp()
    {
        var builder = Program.CreateHostBuilder([]);
        var host = builder.Build();

        Log.Logger = new LoggerConfiguration().WriteTo.NUnitOutput().CreateLogger();
        var mediator = host.Services.GetRequiredService<IMediator>();

        var applicationId = Guid.Parse("7547f1d4-0bbc-49f5-8a93-2f1b20fe1307");
        _recipe = await mediator.Send(
            new GetDummyDeployment.Query("custom-image", "testing", applicationId)
        );

        _deploymentService = host.Services.GetRequiredService<DeploymentService>();
        _dockerHelper = host.Services.GetRequiredService<IDockerHelper>();
    }

    [TearDown]
    public async Task Cleanup()
    {
        var cloudCrafterContainers = await _dockerHelper.GetContainersFromFilter(
            new DockerContainerFilter() { OnlyCloudCrafterLabels = true }
        );

        foreach (var container in cloudCrafterContainers)
        {
            await _dockerHelper.StopContainers([container.ID]);
            await _dockerHelper.RemoveContainers([container.ID]);
        }
    }

    [Test]
    public async Task ShouldBeAbleToValidateRecipe()
    {
        await _deploymentService.ValidateRecipe(_recipe);

        // it at least should not throw an exception
        true.Should().BeTrue();
    }

    [Test]
    public async Task ShouldBeAbleToDeployRecipe()
    {
        await EnsureNetworkExists("cloudcrafter");
        var nixpacksDockerBuildStep = _recipe.BuildOptions.Steps.FirstOrDefault(x =>
            x.Type == DeploymentBuildStepType.NixpacksBuildDockerImage
        );

        nixpacksDockerBuildStep.Should().NotBeNull();
        var repository = nixpacksDockerBuildStep!.Params["image"].ToString();
        var tag = nixpacksDockerBuildStep.Params["tag"].ToString();

        repository.Should().NotBeNull();
        tag.Should().NotBeNull();

        var fullImage = $"{repository}:{tag}";

        var dummyDockerCompose = GetDummyEditor(repository!, tag!);

        var dockerComposeYaml = dummyDockerCompose.GetYaml();

        await Verify(dockerComposeYaml);

        var base64Yaml = dummyDockerCompose.ToBase64();

        var tmpDirectory = "/tmp/cloudcrafter-data/" + RandomGenerator.String();

        _recipe.DockerComposeOptions = new DeploymentRecipeDockerComposeOptions
        {
            Base64DockerCompose = base64Yaml,
            DockerComposeDirectory = tmpDirectory,
        };

        var recipeYaml = new YamlRecipeWriter(_recipe);
        var recipeYamlString = recipeYaml.WriteString();

        var recipeReader = new YamlRecipeReader();

        var recipeFromYaml = recipeReader.FromString(recipeYamlString);
        await _deploymentService.ValidateRecipe(recipeFromYaml);

        await _deploymentService.DeployAsync(recipeFromYaml);

        // it at least should not throw an exception
        true.Should().BeTrue();

        await ShouldHaveDockerImage(fullImage);
        await ShouldHaveEndpointResponse("http://localhost:3000", "Hello World!");
    }
}
