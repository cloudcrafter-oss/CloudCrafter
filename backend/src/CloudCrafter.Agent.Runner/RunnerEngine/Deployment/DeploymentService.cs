﻿using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.MediatR.Commands;
using CloudCrafter.Agent.Runner.Validators;
using FluentValidation;
using MediatR;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public class DeploymentService(ISender sender, IMessagePump pump)
{
    private readonly IDeploymentLogger Logger = pump.CreateLogger<DeploymentService>();

    public async Task DeployAsync(DeploymentRecipe recipe, bool dryRun = false)
    {
        var context = new DeploymentContext(recipe, dryRun);

        await sender.Send(new CreateAndWriteArtifacts.Query(context));

        try
        {
            foreach (var step in recipe.BuildOptions.Steps)
            {
                await sender.Send(new ExecuteBuildStepCommand.Query(step, context));
            }
        }
        catch (ValidationException ex)
        {
            var firstError = ex.Errors.FirstOrDefault()?.ErrorMessage;
            Logger.LogException(ex, $"Validation error occurred during deployment: {firstError}");
            throw;
        }

        //await sender.Send(new CleanupArtifactsDirectory.Query(context));
    }

    public async Task ValidateRecipe(DeploymentRecipe recipe)
    {
        var validator = new DeploymentRecipeValidator();

        await validator.ValidateAndThrowAsync(recipe);

        await DeployAsync(recipe, true);
    }
}
