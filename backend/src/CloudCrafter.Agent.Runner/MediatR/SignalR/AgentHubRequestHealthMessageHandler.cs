using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.SignalR;
using CloudCrafter.Agent.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Shared.Deployment.Docker.Labels;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.MediatR.SignalR;

public static class AgentHubRequestHealthMessageHandler
{
    public record Query(
        AgentHubRequestHealthMessage Message,
        TypedHubConnection<IAgentHub> TypedHubConnection
    ) : IRequest;

    private class Handler(ILogger<Handler> logger, IDockerHelper dockerHelper)
        : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Received request health message from CloudCrafter server");

            var cloudCrafterManagedContainers = await dockerHelper.GetContainersFromFilter(
                new DockerContainerFilter { OnlyCloudCrafterLabels = true }
            );

            var report = new ContainerHealthCheckArgs { Info = [] };

            var stackLabel = CloudCrafterLabelKeys.StackId;
            var stackServiceLabel = CloudCrafterLabelKeys.StackServiceId;
            try
            {
                foreach (var container in cloudCrafterManagedContainers)
                {
                    if (!container.Labels.TryGetValue(stackLabel, out var stackId))
                    {
                        logger.LogCritical(
                            "Container {ContainerId} with name {ContainerName} does not have a stack id label",
                            container.ID,
                            container.Names.FirstOrDefault()
                        );
                        continue;
                    }

                    if (!Guid.TryParse(stackId, out var stackGuid))
                    {
                        logger.LogCritical(
                            "Container {ContainerId} with name {ContainerName} does not have valid Guid label",
                            container.ID,
                            container.Names.FirstOrDefault()
                        );
                        continue;
                    }

                    if (!container.Labels.TryGetValue(stackServiceLabel, out var stackServiceId))
                    {
                        logger.LogCritical(
                            "Container {ContainerId} with name {ContainerName} does not have a stack service id label",
                            container.ID,
                            container.Names.FirstOrDefault()
                        );
                        continue;
                    }

                    if (!Guid.TryParse(stackServiceId, out var stackServiceGuid))
                    {
                        logger.LogCritical(
                            "Container {ContainerId} with name {ContainerName} does not have valid Guid label",
                            container.ID,
                            container.Names.FirstOrDefault()
                        );
                        continue;
                    }

                    var stackInfo = report.Info.GetValueOrDefault(
                        stackGuid,
                        new ContainerHealthCheckStackInfo { StackServices = [] }
                    );
                    if (!report.Info.ContainsKey(stackGuid))
                    {
                        report.Info[stackGuid] = stackInfo;
                    }

                    var containerInfo = await dockerHelper.GetDockerContainer(container.ID);

                    var health = ContainerHealthCheckStackInfoHealthStatus.Unknown;

                    var isRunning = containerInfo.State.Running;

                    if (containerInfo.State.Health != null)
                    {
                        var healthStatus = containerInfo.State.Health.Status;
                        var isUnhealthy = healthStatus == "unhealthy";
                        var isHealthy = healthStatus == "healthy";

                        health =
                            isUnhealthy ? ContainerHealthCheckStackInfoHealthStatus.Unhealthy
                            : isHealthy ? ContainerHealthCheckStackInfoHealthStatus.Healthy
                            : ContainerHealthCheckStackInfoHealthStatus.Degraded;
                    }

                    stackInfo.StackServices.Add(
                        stackServiceGuid,
                        new ContainerHealthOptions { IsRunning = isRunning, Status = health }
                    );

                    // var status = container.Status;
                    // var state = container.State;
                }
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "Error while processing health check: {Error}", ex.Message);
            }

            await request.TypedHubConnection.InvokeAsync(hub => hub.ReportContainerHealth(report));
            logger.LogInformation("Done getting containers from Docker");
        }
    }
}
