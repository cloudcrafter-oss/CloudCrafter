using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;

namespace CloudCrafter.Agent.Runner.RunnerEngine;

public class RunnerEngine(DeploymentRecipe recipe)
{
    private readonly DeploymentContext _context = new();
    private readonly DeploymentRecipe _recipe = recipe;
}
