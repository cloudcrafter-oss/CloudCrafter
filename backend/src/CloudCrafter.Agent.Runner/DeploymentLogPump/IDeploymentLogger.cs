using FluentValidation;

namespace CloudCrafter.Agent.Runner.DeploymentLogPump;

public interface IDeploymentLogger
{
    void LogInfo(string message);
    void LogException(Exception exception, string message);
}
