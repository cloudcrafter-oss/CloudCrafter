using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Validators;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class NixpacksWritePlanToFileSystemHandler(
    IMessagePump pump,
    IFileSystemHelper fileSystemHelper
) : BaseDeploymentStep<NixpacksWritePlanToFileSystemParams>
{
    private readonly IDeploymentLogger _logger =
        pump.CreateLogger<NixpacksWritePlanToFileSystemHandler>();

    public override DeploymentBuildStepType Type =>
        DeploymentBuildStepType.NixpacksWritePlanToFileSystem;

    public override IValidator<NixpacksWritePlanToFileSystemParams> Validator =>
        new NixpacksWritePlanToFileSystemValidator();

    public override async Task ExecuteAsync(
        NixpacksWritePlanToFileSystemParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Writing Nixpacks plan to filesystem");

        var plan = context.GetRecipeResult<string>(RecipeResultKeys.NixpacksBuildPlan);

        if (string.IsNullOrWhiteSpace(plan))
        {
            throw new DeploymentException("Nixpacks plan not found - cannot write to filesystem.");
        }

        var planPath = context.GetGitDirectory() + "/nixpacks-plan.toml";
        await fileSystemHelper.WriteFile(planPath, plan);

        context.SetRecipeResult(RecipeResultKeys.NixpacksTomlLocation, planPath);

        _logger.LogInfo($"Successfully wrote Nixpacks plan to '{planPath}'");
    }

    public override Task DryRun(
        NixpacksWritePlanToFileSystemParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Writing Nixpacks plan to file system");

        return Task.CompletedTask;
    }
}
