using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli;
using CloudCrafter.Agent.Runner.DeploymentLogPump;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

[DeploymentStep(DeploymentBuildStepType.FetchGitRepository)]
public class CheckoutGitRepositoryStepHandler(IMessagePump pump, ICommandExecutor executor)
    : IDeploymentStepHandler<GitCheckoutParams>
{
    private readonly IDeploymentLogger _logger = pump.CreateLogger<CheckoutGitRepositoryStepHandler>();

    public async Task ExecuteAsync(GitCheckoutParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Start ExecuteAsync");

        var repositoryUrl = parameters.Repo;
        var workingDir = context.GetWorkingDirectory();

        var gitDirectory = $"{workingDir}/git";

        _logger.LogInfo($"Cloning repository {repositoryUrl} to {gitDirectory}");

        var result = await executor.ExecuteAsync("git", ["clone", repositoryUrl, gitDirectory]);

        if (result.ExitCode != 0)
        {
            _logger.LogCritical("Failed to clone git repository");
            throw new DeploymentException("Failed to clone git repository");
        }
    }

    public Task DryRun(GitCheckoutParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Checkout Git Repository dryrun");

        return Task.CompletedTask;
    }
}
