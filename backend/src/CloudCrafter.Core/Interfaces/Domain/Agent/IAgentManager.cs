using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Core.Interfaces.Domain.Agent;

public interface IAgentManager
{
    Task SendPingToAgent(Guid serverId);
    Task SendRecipeToAgent(Guid serverId, DeploymentRecipe recipe);
}
