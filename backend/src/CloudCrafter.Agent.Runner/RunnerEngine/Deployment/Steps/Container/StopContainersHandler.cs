using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;
using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.Container;

[DeploymentStep(DeploymentBuildStepType.StopContainers)]
public class StopContainersHandler(IMessagePump pump, IDockerHelper dockerHelper)
    : IDeploymentStepHandler<StopContainersParams>
{
    private readonly IDeploymentLogger _logger = pump.CreateLogger<ContainerHealthCheckHandler>();

    public async Task ExecuteAsync(StopContainersParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Stopping containers based on the provided filters");

        DockerContainerFilter filter = new();
        
        if (parameters.Filters.TryGetValue("labels", out var rawLabelFilters))
        {
            var labelFilters = rawLabelFilters
                .Select(DockerLabelFilter.Parse)
                .ToList();

            filter.LabelFilters = labelFilters;
        }

        filter.OnlyCloudCrafterLabels = parameters.OnlyCloudCrafterContainers;


        var containers = await dockerHelper.GetContainersFromFilter(filter);

        if (containers.Any())
        {
            _logger.LogInfo($"Found {containers.Count()} containers to stop and remove");

            var containerIds = containers.Select(x => x.ID)
                .ToList();

            await dockerHelper.StopContainers(containerIds);
            await dockerHelper.RemoveContainers(containerIds);
        }

        _logger.LogInfo("All containers stopped based on the provided filters");

 
    }

    public Task DryRun(StopContainersParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Stopping containers in dry run mode");

        return Task.CompletedTask;
    }
}
