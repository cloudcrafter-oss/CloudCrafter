using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class CheckoutGitRepositoryStep : IDeploymentStep
{

    public Task ExecuteAsync(DeploymentBuildStep step, DeploymentContext context)
    {
        Console.WriteLine("Checking out git repository");

        return Task.CompletedTask;
    }
}
