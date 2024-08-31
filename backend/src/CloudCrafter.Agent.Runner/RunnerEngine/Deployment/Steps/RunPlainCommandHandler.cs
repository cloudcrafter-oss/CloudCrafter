using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Shared.Utils.Cli.Abstraction;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;

[DeploymentStep(DeploymentBuildStepType.RunPlainCommand)]
public class RunPlainCommandHandler(IMessagePump pump, ICommandExecutor commandExecutor)
    : IDeploymentStepHandler<RunPlainCommandParams>
{
    private readonly IDeploymentLogger _logger = pump.CreateLogger<RunPlainCommandHandler>();

    public async Task ExecuteAsync(RunPlainCommandParams parameters, DeploymentContext context)
    {
        _logger.LogInfo($"Executing provided command: '{parameters.Command}'");


        // params is a string
        var parts = parameters.Command.Split(' ', 2);
        var command = parts[0];
        var arguments = parts.Length > 1 ? parts[1].Split(' ') : [];

        _logger.LogInfo($"Command: {command}");
        _logger.LogInfo($"Arguments: {string.Join(", ", arguments)}");

        try
        {
            await commandExecutor.ExecuteAsync(command, arguments);

            _logger.LogInfo("Command executed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogCritical($"Command execution failed: {ex.Message}");

            if (!parameters.AllowFailure.GetValueOrDefault())
            {
                throw;
            }

            _logger.LogInfo("Command execution failed but allowed to fail");
        }
    }

    public Task DryRun(RunPlainCommandParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Running plain command in dry run mode");

        return Task.CompletedTask;
    }
}
