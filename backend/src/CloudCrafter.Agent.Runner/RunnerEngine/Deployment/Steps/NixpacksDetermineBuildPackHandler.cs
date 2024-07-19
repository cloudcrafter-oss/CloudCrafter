using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers;
using CloudCrafter.Agent.Runner.DeploymentLogPump;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

[DeploymentStep(DeploymentBuildStepType.NixpacksDetermineBuildPack)]
// ReSharper disable once UnusedType.Global
public class NixpacksDetermineBuildPackHandler(IMessagePump pump, INixpacksHelper nixpacksHelper)
    : IDeploymentStepHandler<NixpacksDetermineBuildPackParams>
{
    private readonly IDeploymentLogger _logger = pump.CreateLogger<NixpacksDetermineBuildPackHandler>();
    public async Task ExecuteAsync(NixpacksDetermineBuildPackParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Starting nixpacks build pack handler");

        var fullPath = context.GetWorkingDirectory() + $"/git/{parameters.Path}";
        
        var nixpackPack = await nixpacksHelper.DetermineBuildPackAsync(fullPath);
       
        _logger.LogInfo($"Determined build pack: '{nixpackPack}'");

        context.SetRecipeResult(RecipeResultKeys.NixpacksBuildPack, nixpackPack);
    }

    public Task DryRun(NixpacksDetermineBuildPackParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Determine nixpacks build pack handler");

        return Task.CompletedTask;
    }
}
