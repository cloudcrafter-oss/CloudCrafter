using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public interface IDockerHealthCheckHelper
{
    Task<bool> IsHealthyAsync(ContainerHealthCheckParamsOptions options);
}
