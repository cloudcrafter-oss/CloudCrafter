using CloudCrafter.Agent.Console.Commands;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using YamlDotNet.Serialization.ObjectGraphVisitors;

namespace CloudCrafter.Agent.Console.IntegrationTests.DummyDeployment;

public class SuccessfulDummyDeploymentTest
{
    private DeploymentService _deploymentService;
    private DeploymentRecipe _recipe;

    [SetUp]
    public async Task SetUp()
    {
        var builder = Program.CreateHostBuilder([]);
        var host = builder.Build();


        var mediator = host.Services.GetRequiredService<IMediator>();
        _recipe = await mediator.Send(new GetDummyDeployment.Query());

        _deploymentService = host.Services.GetRequiredService<DeploymentService>();
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
        var nixpacksDockerBuildStep = _recipe.BuildOptions.Steps.FirstOrDefault(x =>
            x.Type == DeploymentBuildStepType.NixpacksBuildDockerImage);

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

        _recipe.DockerComposeOptions = new() { Base64DockerCompose = base64Yaml };
        
        await _deploymentService.DeployAsync(_recipe);

        // it at least should not throw an exception
        true.Should().BeTrue();



        await ShouldHaveDockerImage(fullImage);
    }
}
