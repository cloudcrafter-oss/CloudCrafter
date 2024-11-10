using CloudCrafter.Agent.SignalR.Models;

namespace CloudCrafter.Agent.SignalR;

public interface IAgentHub
{
    // Host Healthcheck
    Task HealthCheckCommand(HealthCheckCommandArgs args);

    // Deployments
    Task DeploymentOutput(DeploymentOutputArgs args);
    Task MarkDeploymentStarted(Guid deploymentId);
    Task MarkDeploymentFinished(Guid deploymentId);
    Task MarkDeploymentFailed(Guid deploymentId);

    // Container Health
    Task ReportContainerHealth(ContainerHealthCheckArgs args);
}
