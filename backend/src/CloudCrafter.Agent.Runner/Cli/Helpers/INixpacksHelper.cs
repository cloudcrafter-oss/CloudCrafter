namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public interface INixpacksHelper
{
    Task<string> DetermineBuildPackAsync(string nixpacksPath);
}
