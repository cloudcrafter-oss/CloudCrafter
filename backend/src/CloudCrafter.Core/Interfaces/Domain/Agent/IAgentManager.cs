﻿using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Core.Interfaces.Domain.Agent;

public interface IAgentManager
{
    Task SendPingToAgents();
    Task SendRecipeToAgent(Guid serverId, Guid deploymentId, DeploymentRecipe recipe);
}
