using CloudCrafter.Agent.Models.Exceptions;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public class NixpacksHelper(ICommandExecutor executor, ICommandParser parser) : INixpacksHelper
{
    private const string NixpacksExecutable = "nixpacks";
    public async Task<string> DetermineBuildPackAsync(string nixpacksPath)
    {
        await EnsureNixpacksInstalled();

        var result = await executor.ExecuteAsync(NixpacksExecutable, ["detect", nixpacksPath]);

        if (!result.IsSuccess || string.IsNullOrWhiteSpace(result.StdOut))
        {
            throw new DeploymentException($"Could not determine build pack, directory: {nixpacksPath}");
        }


        var parsedResult = parser.ParseSingleOutput(result.StdOut);

        return parsedResult;
    }

    private async Task EnsureNixpacksInstalled()
    {
        var result = await executor.ExecuteAsync(NixpacksExecutable, ["-V"]);

        if (!result.IsSuccess)
        {
            throw new DeploymentException("Nixpacks is not installed or version cannot be determined");
        }
    }
}
