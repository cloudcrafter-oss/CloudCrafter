using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers;
using CloudCrafter.Agent.Runner.DeploymentLogPump;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.Container;

[DeploymentStep(DeploymentBuildStepType.ContainerHealthCheck)]
public class ContainerHealthCheckHandler(IMessagePump pump, IDockerHealthCheckHelper dockerHealthCheckHelper)
    : IDeploymentStepHandler<ContainerHealthCheckParams>
{
    private readonly IDeploymentLogger _logger = pump.CreateLogger<ContainerHealthCheckHandler>();

    public async Task ExecuteAsync(ContainerHealthCheckParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Running container health check");

        // This is already validated, but better safe than sorry.
        if (parameters.Options == null)
        {
            throw new DeploymentException("Container health check options not found.");
        }

        var containerIsHealthy = await dockerHealthCheckHelper.IsHealthyAsync(parameters.Options);

        if (!containerIsHealthy)
        {
            _logger.LogCritical("Container did not become healthy within a timely manner.");
            throw new DeploymentException("Container health check failed.");
        }


        _logger.LogInfo("Container is healthy");
    }

    public Task DryRun(ContainerHealthCheckParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Running container health check in dry run mode");

        return Task.CompletedTask;
    }
}
