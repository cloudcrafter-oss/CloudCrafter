namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public interface IDockerHelper
{
    Task RunCommandInContainer(string containerName, string command, Action<DockerHelperResponse>? onLog = null);
}
