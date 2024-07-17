using CliWrap;
using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli;
using CloudCrafter.Agent.Runner.DeploymentLogPump;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class CheckoutGitRepositoryStep(IMessagePump pump, ICommandExecutor executor) : IDeploymentStep
{
    private readonly IDeploymentLogger Logger = pump.CreateLogger<CheckoutGitRepositoryStep>();

    public async Task ExecuteAsync(DeploymentBuildStep step, DeploymentContext context)
    {
        Logger.LogInfo("Start ExecuteAsync");

        var repositoryUrl = context.Recipe.Source.Git!.Repository;
        var workingDir = context.GetWorkingDirectory();

        var gitDirectory = $"{workingDir}/git";
        
        Logger.LogInfo($"Cloning repository {repositoryUrl} to {gitDirectory}");
        await executor.ExecuteAsync("git", $"clone {repositoryUrl} {gitDirectory}");
    }
}
