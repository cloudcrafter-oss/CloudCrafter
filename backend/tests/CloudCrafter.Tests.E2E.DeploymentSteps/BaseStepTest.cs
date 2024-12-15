using CloudCrafter.Agent.Console;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.IO;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.Agent.Runner.MediatR.Commands;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CloudCrafter.Tests.E2E.DeploymentSteps;

public abstract class BaseStepTest
{
    private DeploymentStepSerializerFactory GetFactory()
    {
        var host = GetHost();
        return host.Services.GetRequiredService<DeploymentStepSerializerFactory>();
    }

    private static IHost GetHost()
    {
        var builder = Program.CreateHostBuilder([]);
        var host = builder.Build();
        return host;
    }

    protected async Task DryRunStep(DeploymentBuildStep step, DeploymentRecipe recipe)
    {
        var host = GetHost();
        var sender = host.Services.GetRequiredService<ISender>();
        var ctx = new DeploymentContext(recipe, true);

        await sender.Send(new ExecuteBuildStepCommand.Query(step, ctx));
    }

    protected TParams Validate<TParams>(DeploymentBuildStep step)
        where TParams : BaseParams
    {
        var serializerFactory = GetFactory();
        var handler = serializerFactory.GetHandler<TParams>(step);
        return serializerFactory.ConvertAndValidateParams(step.Params, handler.Validator);
    }

    protected DeploymentRecipe GetRecipeWithStep(DeploymentBuildStep step)
    {
        var guid = Guid.Parse("96ca27ea-518d-4e2c-83ea-c2ea08be24aa");
        var recipe = new DeploymentRecipe
        {
            Name = "Dummy",
            Application = new DeploymentRecipeApplicationInfo { Id = Guid.Empty },
            Destination = new DeploymentRecipeDestination
            {
                RootDirectory = "/root",
                GitCheckoutDirectory = $"/data/cloudcrafter/{guid}",
            },
            EnvironmentVariables = new DeploymentRecipeEnvironmentVariableConfig
            {
                Variables = new Dictionary<string, DeploymentRecipeEnvironmentVariable>(),
            },
            BuildOptions = new DeploymentBuildOptions { Steps = [step] },
        };

        return recipe;
    }

    protected string GetYaml(DeploymentRecipe recipe)
    {
        var yamlWriter = new YamlRecipeWriter(recipe);
        return yamlWriter.WriteString();
    }

    protected DeploymentRecipe GetFromYaml(string yaml)
    {
        var yamlReader = new YamlRecipeReader();
        return yamlReader.FromString(yaml);
    }
}
