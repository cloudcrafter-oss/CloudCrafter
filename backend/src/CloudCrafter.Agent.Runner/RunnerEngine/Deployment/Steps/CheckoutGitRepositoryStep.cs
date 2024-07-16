using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class CheckoutGitRepositoryStep(IMessagePump pump) : IDeploymentStep
{
    private readonly IDeploymentLogger Logger = pump.CreateLogger<CheckoutGitRepositoryStep>();
    public Task ExecuteAsync(DeploymentBuildStep step, DeploymentContext context)
    {
        Logger.LogInfo("Checking out git repository");

        return Task.CompletedTask;
    }
}
