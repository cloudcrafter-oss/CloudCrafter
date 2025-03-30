using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Validators;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class NixpacksDetermineBuildPackHandler(IMessagePump pump, INixpacksHelper nixpacksHelper)
    : BaseDeploymentStep<NixpacksDetermineBuildPackParams>
{
    private readonly IDeploymentLogger _logger =
        pump.CreateLogger<NixpacksDetermineBuildPackHandler>();

    public override DeploymentBuildStepType Type =>
        DeploymentBuildStepType.NixpacksDetermineBuildPack;

    public override async Task ExecuteAsync(
        NixpacksDetermineBuildPackParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Starting nixpacks build pack handler");

        var fullPath = context.GetGitDirectory() + $"/git/{parameters.Path}";

        var nixpacksPack = await nixpacksHelper.DetermineBuildPackAsync(fullPath);

        if (string.IsNullOrWhiteSpace(nixpacksPack))
        {
            throw new DeploymentException("Failed to determine build pack");
        }

        _logger.LogInfo($"Determined build pack: '{nixpacksPack}'");

        context.SetRecipeResult(RecipeResultKeys.NixpacksBuildPack, nixpacksPack);
    }

    public override Task DryRun(
        NixpacksDetermineBuildPackParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Determine nixpacks build pack handler");

        return Task.CompletedTask;
    }

    public override IValidator<NixpacksDetermineBuildPackParams> Validator =>
        new NixpacksDetermineBuildPackValidator();
}
