using Docker.DotNet.Models;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public interface IDockerHelper
{
    Task<DockerHelperResponseResult> RunCommandInContainer(string containerName, IList<string> commands, Action<DockerHelperResponse>? onLog = null);
    Task<ContainerInspectResponse> GetDockerContainer(string containerId);
}
