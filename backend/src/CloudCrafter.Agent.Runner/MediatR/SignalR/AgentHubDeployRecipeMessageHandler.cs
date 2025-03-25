using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.Common.Interfaces;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.Agent.Runner.SignalR;
using CloudCrafter.Agent.SignalR;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.MediatR.SignalR;

public record AgentHubDeployRecipeCommand(
    AgentHubDeployRecipeMessage Message,
    TypedHubConnection<IAgentHub> TypedHubConnection,
    Guid ChannelId
) : IRequest, IAgentLoggable;

internal class AgentHubDeployRecipeCommandHandler : IRequestHandler<AgentHubDeployRecipeCommand>
{
    private readonly DeploymentService _deploymentService;
    private readonly ILogger<AgentHubDeployRecipeCommandHandler> _logger;

    public AgentHubDeployRecipeCommandHandler(
        DeploymentService deploymentService,
        ILogger<AgentHubDeployRecipeCommandHandler> logger
    )
    {
        _deploymentService = deploymentService;
        _logger = logger;
    }

    public async Task Handle(
        AgentHubDeployRecipeCommand request,
        CancellationToken cancellationToken
    )
    {
        _logger.LogDebug("Marking deployment as started");
        await request.TypedHubConnection.InvokeAsync(hub =>
            hub.MarkDeploymentStarted(request.Message.DeploymentId)
        );
        _logger.LogDebug("Received deploy recipe message from CloudCrafter server");
        _logger.LogDebug("Validating recipe...");

        try
        {
            await _deploymentService.ValidateRecipe(request.Message.Recipe);
            _logger.LogInformation("Recipe validated!");

            _logger.LogInformation("Deploying recipe...");
            await _deploymentService.DeployAsync(request.Message.Recipe);
            _logger.LogInformation("Recipe deployed!");

            await request.TypedHubConnection.InvokeAsync(hub =>
                hub.MarkDeploymentFinished(request.Message.DeploymentId)
            );
        }
        catch (DeploymentException deploymentException)
        {
            _logger.LogCritical(deploymentException, "Error while deploying recipe");
            await request.TypedHubConnection.InvokeAsync(hub =>
                hub.MarkDeploymentFailed(request.Message.DeploymentId)
            );
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Handling deploy recipe message failed");
            await request.TypedHubConnection.InvokeAsync(hub =>
                hub.MarkDeploymentFailed(request.Message.DeploymentId)
            );
        }
    }
}
