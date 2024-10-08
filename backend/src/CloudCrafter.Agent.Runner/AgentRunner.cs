﻿using CloudCrafter.Agent.Models.IO;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Commands;
using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner;

public class AgentRunner(IHost host)
{
    public async Task<int> Run(AgentRunnerArgs args)
    {
        var logger = host.Services.GetRequiredService<ILogger<AgentRunner>>();

        // Base validation
        if (!string.IsNullOrWhiteSpace(args.Base64Recipe) && args.UseDummyDeployment)
        {
            logger.LogCritical("Cannot use both --demo and --from-base64 options");
            return -1;
        }

        var mediator = host.Services.GetRequiredService<IMediator>();

        if (args.GenerateSampleRecipe)
        {
            logger.LogInformation("Generating and saving sample recipe");
            GenerateAndSaveSample(mediator, logger);
            logger.LogInformation("Sample recipe generated and saved");
            return 0;
        }

        DeploymentRecipe? recipe = null;

        if (args.UseDummyDeployment)
        {
            var random = new Random();
            var randomString = new string(
                Enumerable
                    .Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)
                    .Select(s => s[random.Next(s.Length)])
                    .ToArray()
            );

            var applicationId = Guid.Parse("4676dae2-08a5-4a5d-a5f6-5b02a3a77ac7");
            recipe = await mediator.Send(
                new GetDummyDeployment.Query("custom-image", randomString, applicationId)
            );
        }

        if (!string.IsNullOrWhiteSpace(args.Base64Recipe))
        {
            var reader = new YamlRecipeReader();
            recipe = reader.FromBase64(args.Base64Recipe);
        }

        if (!string.IsNullOrWhiteSpace(args.RecipePath))
        {
            recipe = GetFromFile(logger, args.RecipePath);
        }

        if (recipe == null)
        {
            recipe = GetFromCurrentDirectory(logger);
        }

        if (recipe == null)
        {
            logger.LogCritical("Error: No Recipe found - cannot continue");
            return -1;
        }

        var deploymentService = host.Services.GetRequiredService<DeploymentService>();

        try
        {
            await deploymentService.ValidateRecipe(recipe);
            logger.LogInformation("Recipe validated successfully");
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Error validating recipe: {0}", ex.Message);
            return -1;
        }

        if (args.OnlyDryRun)
        {
            return 0;
        }

        try
        {
            logger.LogInformation("Deploying recipe");
            await deploymentService.DeployAsync(recipe);
            logger.LogInformation("Recipe deployed successfully");
        }
        catch (Exception ex)
        {
            logger.LogCritical("Error deploying recipe: {0}", ex.Message);
            return -1;
        }

        return 0;
    }

    private void GenerateAndSaveSample(IMediator mediator, ILogger<AgentRunner> logger)
    {
        var recipe = mediator.Send(new GetMostBasicRecipe.Query()).Result;

        var writer = new YamlRecipeWriter(recipe);

        var currentPath = Directory.GetCurrentDirectory();
        var filename = Path.Combine(currentPath, "recipe.yml");

        logger.LogInformation("Writing sample recipe to {0}", filename);
        writer.WriteToFile(filename);
        logger.LogInformation("Sample recipe written to {0}", filename);
    }

    private DeploymentRecipe? GetFromFile(ILogger<AgentRunner> logger, string file)
    {
        if (!File.Exists(file))
        {
            logger.LogInformation("Recipe file not found: {0}", file);
            return null;
        }

        var recipeReader = new YamlRecipeReader();

        var recipe = recipeReader.FromFile(file);

        return recipe;
    }

    private DeploymentRecipe? GetFromCurrentDirectory(ILogger<AgentRunner> logger)
    {
        var currentPath = Directory.GetCurrentDirectory();
        var filename = Path.Combine(currentPath, "recipe.yml");

        return GetFromFile(logger, filename);
    }

    public class AgentRunnerArgs
    {
        public required bool UseDummyDeployment { get; init; }
        public required string Base64Recipe { get; init; }
        public required bool OnlyDryRun { get; init; }
        public required bool GenerateSampleRecipe { get; init; }
        public required string RecipePath { get; set; }
    }
}
