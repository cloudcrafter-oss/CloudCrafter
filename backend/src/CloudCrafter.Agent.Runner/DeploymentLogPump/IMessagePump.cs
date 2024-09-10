using CloudCrafter.Agent.Models.Shared;

namespace CloudCrafter.Agent.Runner.DeploymentLogPump;

public interface IMessagePump
{
    IDeploymentLogger CreateLogger<T>()
        where T : class;
    List<DeploymentMessage> GetLogs();
}
