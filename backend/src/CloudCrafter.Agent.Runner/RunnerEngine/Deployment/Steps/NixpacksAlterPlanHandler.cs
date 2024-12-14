using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Validators;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class NixpacksAlterPlanHandler(IMessagePump pump)
    : BaseDeploymentStep<NixpacksAlterPlanParams>
{
    private readonly IDeploymentLogger _logger = pump.CreateLogger<NixpacksAlterPlanHandler>();

    public override DeploymentBuildStepType Type => DeploymentBuildStepType.NixpacksAlterPlan;

    public override IValidator<NixpacksAlterPlanParams> Validator =>
        new NixpacksAlterPlanParamsValidator();

    public override Task ExecuteAsync(NixpacksAlterPlanParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Starting altering nixpacks plan");

        var plan = context.GetRecipeResult<string>(RecipeResultKeys.NixpacksBuildPlan);

        if (string.IsNullOrWhiteSpace(plan))
        {
            throw new DeploymentException("Nixpacks plan not found.");
        }

        var editor = new NixpacksTomlEditor(plan);

        var environmentVariables = context.Recipe.EnvironmentVariables.Variables;

        if (environmentVariables.Any())
        {
            var buildVariables = environmentVariables
                .Select(x => x.Value)
                .Where(x => x.IsBuildVariable)
                .ToDictionary(x => x.Name, x => x.Value);

            editor.AddVariables(buildVariables);
        }

        var packagesToAdd = parameters.Packages;
        editor.AddPackages(packagesToAdd);
        editor.AddPackages(["curl", "wget"]);

        var toml = editor.GetToml();

        context.SetRecipeResult(RecipeResultKeys.NixpacksBuildPlan, toml);

        return Task.CompletedTask;
    }

    public override Task DryRun(NixpacksAlterPlanParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Alter nixpacks plan handler");

        return Task.CompletedTask;
    }
}
