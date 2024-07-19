using CloudCrafter.Agent.Models.Deployment.Steps.Params;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public interface INixpacksHelper
{
    Task<string> DetermineBuildPackAsync(string nixpacksPath);
    Task<string> GetBuildPlanAsync(string fullPath, NixpacksGeneratePlanParams parameters);
}
