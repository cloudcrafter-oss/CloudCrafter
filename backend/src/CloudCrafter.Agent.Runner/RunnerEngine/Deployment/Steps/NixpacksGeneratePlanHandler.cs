using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Validators;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class NixpacksGeneratePlanHandler(IMessagePump pump, INixpacksHelper nixpacksHelper)
    : BaseDeploymentStep<NixpacksGeneratePlanParams>
{
    private readonly IDeploymentLogger _logger = pump.CreateLogger<NixpacksGeneratePlanHandler>();

    public override DeploymentBuildStepType Type => DeploymentBuildStepType.NixpacksGeneratePlan;

    public override IValidator<NixpacksGeneratePlanParams> Validator =>
        new NixpacksGeneratePlanParamsValidator();

    public override async Task ExecuteAsync(
        NixpacksGeneratePlanParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Starting nixpacks plan handler");
        var fullPath = context.GetGitDirectory() + $"/git/{parameters.Path}";

        var plan = await nixpacksHelper.GetBuildPlanAsync(fullPath, parameters);

        context.SetRecipeResult(RecipeResultKeys.NixpacksBuildPlan, plan);
        _logger.LogInfo("Saved nixpacks plan to to context.");
    }

    public override Task DryRun(NixpacksGeneratePlanParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Generate nixpacks plan handler");

        return Task.CompletedTask;
    }
}
