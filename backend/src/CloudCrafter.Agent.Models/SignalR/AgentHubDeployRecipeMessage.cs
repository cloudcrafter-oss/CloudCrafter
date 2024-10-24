using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.SignalR;

public class AgentHubDeployRecipeMessage : AgentBaseMessage
{
    public required DateTime Timestamp { get; init; }

    public required DeploymentRecipe Recipe { get; set; }
    public required Guid DeploymentId { get; init; }
}
