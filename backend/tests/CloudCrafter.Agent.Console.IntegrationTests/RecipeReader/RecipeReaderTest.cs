using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace CloudCrafter.Agent.Console.IntegrationTests.RecipeReader;

public class RecipeReaderTest
{
    [Test]
    public async Task ShouldBeAbleToCreateRecipeFromDefaultYaml()
    {
        var data = File.ReadLines("recipe.yml");

        var schema = string.Join(Environment.NewLine, data);

        schema.Should().NotBeEmpty();

        var reader = new YamlRecipeReader();

        var recipe = reader.FromString(schema);

        recipe.Should().NotBeNull();

        var builder = Program.CreateHostBuilder([]);
        var host = builder.Build();
        Log.Logger = new LoggerConfiguration().WriteTo.NUnitOutput().CreateLogger();

        var deploymentService = host.Services.GetRequiredService<DeploymentService>();

        await deploymentService.ValidateRecipe(recipe);

        true.Should().Be(true);
    }
}
