using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner.Common.Interfaces;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.Agent.Runner.SignalR;
using CloudCrafter.Agent.SignalR;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.MediatR.SignalR;

public static class AgentHubDeployRecipeMessageHandler
{
    public record Command(
        AgentHubDeployRecipeMessage Message,
        TypedHubConnection<IAgentHub> TypedHubConnection,
        Guid ChannelId
    ) : IRequest, IAgentLoggable;

    private class Handler(DeploymentService deploymentService, ILogger<Handler> logger)
        : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            logger.LogDebug("Marking deployment as started");
            await request.TypedHubConnection.InvokeAsync(hub =>
                hub.MarkDeploymentStarted(request.Message.DeploymentId)
            );
            logger.LogDebug("Received deploy recipe message from CloudCrafter server");
            logger.LogDebug("Validating recipe...");

            try
            {
                await deploymentService.ValidateRecipe(request.Message.Recipe);
                logger.LogInformation("Recipe validated!");

                logger.LogInformation("Deploying recipe...");
                await deploymentService.DeployAsync(request.Message.Recipe);
                logger.LogInformation("Recipe deployed!");

                await request.TypedHubConnection.InvokeAsync(hub =>
                    hub.MarkDeploymentFinished(request.Message.DeploymentId)
                );
            }
            catch (DeploymentException deploymentException)
            {
                logger.LogCritical(deploymentException, "Error while deploying recipe");
                await request.TypedHubConnection.InvokeAsync(hub =>
                    hub.MarkDeploymentFailed(request.Message.DeploymentId)
                );
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "Handling deploy recipe message failed");
                await request.TypedHubConnection.InvokeAsync(hub =>
                    hub.MarkDeploymentFailed(request.Message.DeploymentId)
                );
            }
        }
    }
}
