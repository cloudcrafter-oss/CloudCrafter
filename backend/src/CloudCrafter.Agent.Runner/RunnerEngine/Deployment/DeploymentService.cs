using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.MediatR.Commands;
using MediatR;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment;

public class DeploymentService(ISender sender)
{
    public async Task DeployAsync(DeploymentRecipe recipe)
    {
        var context = new DeploymentContext(recipe);

        await sender.Send(new CreateAndWriteArtifacts.Query(context));
        
        foreach (var step in recipe.BuildOptions.Steps)
        {
            await sender.Send(new ExecuteBuildStepCommand.Query(step, context));
        }
    }
}
