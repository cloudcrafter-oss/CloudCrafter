using CliWrap;
using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli;
using CloudCrafter.Agent.Runner.DeploymentLogPump;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

public class CheckoutGitRepositoryStepHandler(IMessagePump pump, ICommandExecutor executor) : IDeploymentStepHandler<GitCheckoutParams>
{
    private readonly IDeploymentLogger Logger = pump.CreateLogger<CheckoutGitRepositoryStepHandler>();

    public async Task ExecuteAsync(GitCheckoutParams parameters, DeploymentContext context)
    {
        Logger.LogInfo("Start ExecuteAsync");

        var repositoryUrl = parameters.Repo;
        var workingDir = context.GetWorkingDirectory();

        var gitDirectory = $"{workingDir}/git";
        
        Logger.LogInfo($"Cloning repository {repositoryUrl} to {gitDirectory}");
        await executor.ExecuteAsync("git", $"clone {repositoryUrl} {gitDirectory}");
    }
}
