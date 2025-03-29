using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Validators;
using FluentValidation;
using NixpacksBuildDockerImageConfig = CloudCrafter.Agent.Models.Configs.NixpacksBuildDockerImageConfig;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class NixpacksBuildDockerImageHandler(IMessagePump pump, INixpacksHelper nixpacksHelper)
    : BaseDeploymentStep<NixpacksBuildDockerImageParams>
{
    private readonly IDeploymentLogger _logger =
        pump.CreateLogger<NixpacksBuildDockerImageHandler>();

    public override DeploymentBuildStepType Type =>
        DeploymentBuildStepType.NixpacksBuildDockerImage;

    public override IValidator<NixpacksBuildDockerImageParams> Validator =>
        new NixpacksBuildDockerImageValidator();

    public override async Task ExecuteAsync(
        NixpacksBuildDockerImageParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Building Docker image via Nixpacks");

        var planPath = context.GetRecipeResult<string>(RecipeResultKeys.NixpacksTomlLocation);

        if (string.IsNullOrWhiteSpace(planPath))
        {
            throw new DeploymentException("Nixpacks plan not found - cannot build Docker image.");
        }

        var workDir = context.GetGitDirectory() + $"/git/{parameters.Path}";

        var image = $"{parameters.Image}:{parameters.Tag}";

        var variables =
            parameters.Env != null
                ? parameters.Env.ToDictionary(x => x.Key, x => x.Value.ToString() ?? string.Empty)
                : new Dictionary<string, string>();

        var result = await nixpacksHelper.BuildDockerImage(
            new NixpacksBuildDockerImageConfig
            {
                PlanPath = planPath,
                WorkDir = workDir,
                ImageName = image,
                DisableCache = parameters.DisableCache.GetValueOrDefault(),
                EnvironmentVariables = variables,
            }
        );

        _logger.LogInfo($"Successfully built Docker image: {image}");
    }

    public override Task DryRun(
        NixpacksBuildDockerImageParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Building Docker image via Nixpacks");

        return Task.CompletedTask;
    }
}
