using CloudCrafter.Agent.Models.Configs;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public class NixpacksHelper(
    ICommandExecutor executor,
    ICommandParser parser,
    ILogger<NixpacksHelper> logger
) : INixpacksHelper
{
    private const string NixpacksExecutable = "nixpacks";

    public async Task<string> DetermineBuildPackAsync(string nixpacksPath)
    {
        await EnsureNixpacksInstalled();

        var result = await executor.ExecuteAsync(NixpacksExecutable, ["detect", nixpacksPath]);

        if (!result.IsSuccess || string.IsNullOrWhiteSpace(result.StdOut))
        {
            throw new DeploymentException(
                $"Could not determine build pack, directory: {nixpacksPath}"
            );
        }

        var parsedResult = parser.ParseSingleOutput(result.StdOut);

        return parsedResult;
    }

    public async Task<string> GetBuildPlanAsync(
        string fullPath,
        NixpacksGeneratePlanParams parameters
    )
    {
        // TODO: Inject build args eventually.
        await EnsureNixpacksInstalled();

        var result = await executor.ExecuteAsync(
            NixpacksExecutable,
            ["plan", "-f", "toml", fullPath]
        );

        if (!result.IsSuccess || string.IsNullOrWhiteSpace(result.StdOut))
        {
            throw new DeploymentException(
                $"Could not generate nixpacks plan for directory: '{fullPath}"
            );
        }

        var parsedResult = parser.ParseSingleOutput(result.StdOut);

        return parsedResult;
    }

    public async Task<ExecutorResult> BuildDockerImage(NixpacksBuildDockerImageConfig config)
    {
        await EnsureNixpacksInstalled();

        List<string> baseCommand = ["build", "-c", config.PlanPath, "-t", config.ImageName];

        if (!config.DisableCache)
        {
            baseCommand.Add("--no-cache");
        }

        if (config.EnvironmentVariables.Count != 0)
        {
            foreach (var env in config.EnvironmentVariables)
            {
                baseCommand.Add("--env");
                baseCommand.Add($"{env.Key}={env.Value}");
            }
        }

        baseCommand.AddRange([config.WorkDir]);

        var result = await executor.ExecuteWithStreamAsync(
            NixpacksExecutable,
            baseCommand,
            streamResult =>
            {
                if (streamResult.IsStdErr)
                {
                    logger.LogCritical(streamResult.Log);
                    return;
                }

                logger.LogInformation(streamResult.Log);
            }
        );

        if (!result.IsSuccess)
        {
            throw new DeploymentException("Could build Nixpacks docker image.");
        }

        return result;
    }

    private async Task EnsureNixpacksInstalled()
    {
        var result = await executor.ExecuteAsync(NixpacksExecutable, ["-V"]);

        if (!result.IsSuccess)
        {
            throw new DeploymentException(
                "Nixpacks is not installed or version cannot be determined"
            );
        }
    }
}
