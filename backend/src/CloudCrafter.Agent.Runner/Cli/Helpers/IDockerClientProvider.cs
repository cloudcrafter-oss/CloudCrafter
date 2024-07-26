using Docker.DotNet;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public interface IDockerClientProvider
{
    IDockerClient GetClient();
}
