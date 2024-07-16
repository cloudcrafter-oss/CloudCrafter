using CliWrap;
using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class CheckoutGitRepositoryStep(IMessagePump pump) : IDeploymentStep
{
    private readonly IDeploymentLogger Logger = pump.CreateLogger<CheckoutGitRepositoryStep>();

    public async Task ExecuteAsync(DeploymentBuildStep step, DeploymentContext context)
    {
        Logger.LogInfo("Start ExecuteAsync");

        var repositoryUrl = context.Recipe.Source.Git!.Repository;
        var workingDir = context.GetWorkingDirectory();
        
        Logger.LogInfo($"Cloning repository {repositoryUrl} to {workingDir}");
        await Cli.Wrap("git")
            .WithArguments($"clone {repositoryUrl} {workingDir}")
            .ExecuteAsync();
        
    }
}
