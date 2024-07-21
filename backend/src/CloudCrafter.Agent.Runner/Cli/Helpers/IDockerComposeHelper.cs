namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public interface IDockerComposeHelper
{
    Task<ExecutorResult> UpAsync(string dockerComposeFile, Action<ExecutorStreamResult>? onLog = null);
}
