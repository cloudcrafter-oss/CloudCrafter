using CloudCrafter.Agent.Models.SignalR;
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
        TypedHubConnection<IAgentHub> TypedHubConnection
    ) : IRequest;

    private class Handler(DeploymentService deploymentService, ILogger<Handler> logger)
        : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            logger.LogDebug("Received deploy recipe message from CloudCrafter server");
            logger.LogDebug("Validating recipe...");

            try
            {
                await deploymentService.ValidateRecipe(request.Message.Recipe);
                logger.LogInformation("Recipe validated!");

                logger.LogInformation("Deploying recipe...");
                await deploymentService.DeployAsync(request.Message.Recipe);
                logger.LogInformation("Recipe deployed!");
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "Handling deploy recipe message failed");
            }
        }
    }
}
