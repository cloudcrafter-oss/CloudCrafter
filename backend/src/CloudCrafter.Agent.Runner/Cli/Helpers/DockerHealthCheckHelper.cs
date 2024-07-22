using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public class DockerHealthCheckHelper : IDockerHealthCheckHelper
{
    public Task<bool> IsHealthyAsync(ContainerHealthCheckParamsOptions options)
    {
        throw new NotImplementedException();
    }
}
