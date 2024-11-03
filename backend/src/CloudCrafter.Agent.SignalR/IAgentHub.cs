using CloudCrafter.Agent.SignalR.Models;

namespace CloudCrafter.Agent.SignalR;

public interface IAgentHub
{
    Task HealthCheckCommand(HealthCheckCommandArgs args);
    Task DeploymentOutput(DeploymentOutputArgs args);
    Task MarkDeploymentStarted(Guid deploymentId);
    Task MarkDeploymentFinished(Guid deploymentId);
    Task MarkDeploymentFailed(Guid deploymentId);
}
