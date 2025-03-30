using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Validators;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.GitCheckout;

public class CheckoutPublicGitRepositoryStepHandler(IMessagePump pump, ICommandExecutor executor)
    : BaseDeploymentStep<GitCheckoutParams>
{
    private readonly IDeploymentLogger _logger =
        pump.CreateLogger<CheckoutPublicGitRepositoryStepHandler>();

    public override DeploymentBuildStepType Type => DeploymentBuildStepType.FetchPublicGitRepository;
    public override IValidator<GitCheckoutParams> Validator => new GitCheckoutParamsValidator();

    public override async Task ExecuteAsync(GitCheckoutParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Start ExecuteAsync");

        var repositoryUrl = parameters.Repo;
        var gitDirectory = context.GetGitDirectory();

        var gitCheckoutDirectory = $"{gitDirectory}/git";

        _logger.LogInfo($"Cloning repository {repositoryUrl} to {gitCheckoutDirectory}");

        var result = await executor.ExecuteAsync(
            "git",
            ["clone", repositoryUrl, gitCheckoutDirectory]
        );

        if (result.ExitCode != 0)
        {
            _logger.LogCritical("Failed to clone git repository");
            throw new DeploymentException("Failed to clone git repository");
        }
    }

    public override Task DryRun(GitCheckoutParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Checkout Git Repository dryrun");

        return Task.CompletedTask;
    }
}
