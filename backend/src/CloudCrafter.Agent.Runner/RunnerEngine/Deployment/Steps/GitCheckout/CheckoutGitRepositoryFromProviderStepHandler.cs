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

public class CheckoutGitRepositoryFromProviderStepHandler(
    IMessagePump pump,
    ICommandExecutor executor
) : BaseDeploymentStep<GitCheckoutFromSourceProviderParams>
{
    private readonly IDeploymentLogger _logger =
        pump.CreateLogger<CheckoutGitRepositoryFromProviderStepHandler>();

    public override DeploymentBuildStepType Type =>
        DeploymentBuildStepType.FetchGitRepositoryFromProvider;
    public override IValidator<GitCheckoutFromSourceProviderParams> Validator =>
        new GitCheckoutFromSourceProviderParamsValidator();

    public override async Task ExecuteAsync(
        GitCheckoutFromSourceProviderParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Start ExecuteAsync");

        var repositoryUrl = parameters.Repository;
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

    public override Task DryRun(
        GitCheckoutFromSourceProviderParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Checkout Git Repository dryrun");

        return Task.CompletedTask;
    }
}
