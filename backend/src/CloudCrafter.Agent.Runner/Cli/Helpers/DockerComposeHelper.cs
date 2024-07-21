using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public class DockerComposeHelper(ICommandExecutor executor, ILogger<DockerComposeHelper> logger) : IDockerComposeHelper
{
    public async Task<ExecutorResult> UpAsync(string dockerComposeFile, Action<ExecutorStreamResult>? onLog = null)
    {
        var result = await executor.ExecuteWithStreamAsync("docker", [
            "compose",
            "-f",
            dockerComposeFile,
            "up",
            "-d"
        ], streamResult =>
        {
            logger.LogInformation(streamResult.Log);
        });

        return result;
    }
}
