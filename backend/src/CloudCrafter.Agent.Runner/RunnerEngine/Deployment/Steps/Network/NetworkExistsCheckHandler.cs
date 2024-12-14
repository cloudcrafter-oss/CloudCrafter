using CloudCrafter.Agent.Models.Deployment.Steps.Params.Network;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Validators.Network;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.Network;

public class NetworkExistsCheckHandler(IMessagePump pump, IDockerHelper dockerHelper)
    : BaseDeploymentStep<NetworkExistsCheckParams>
{
    private readonly IDeploymentLogger _logger = pump.CreateLogger<NetworkExistsCheckHandler>();

    public override DeploymentBuildStepType Type =>
        DeploymentBuildStepType.DockerValidateNetworksExists;

    public override IValidator<NetworkExistsCheckParams> Validator =>
        new NetworkExistsCheckValidator();

    public override async Task ExecuteAsync(
        NetworkExistsCheckParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Checking if provided networks exist");

        var availableNetworks = await dockerHelper.GetNetworks();

        var availableNetworksNames = availableNetworks.Select(x => x.Name).ToList();

        var unavailableNetworks = new List<string>();

        foreach (var networkName in parameters.Networks)
        {
            if (!availableNetworksNames.Contains(networkName))
            {
                unavailableNetworks.Add(networkName);
            }
        }

        if (unavailableNetworks.Any())
        {
            _logger.LogCritical($"Networks {string.Join(", ", unavailableNetworks)} do not exist");
            throw new DeploymentException(
                $"Networks {string.Join(", ", unavailableNetworks)} do not exist"
            );
        }

        _logger.LogInfo("All provided networks exist");
    }

    public override Task DryRun(NetworkExistsCheckParams parameters, DeploymentContext context)
    {
        _logger.LogInfo("Checking if provided networks exist in dry run mode");

        return Task.CompletedTask;
    }
}
