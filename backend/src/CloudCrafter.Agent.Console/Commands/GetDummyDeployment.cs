using CloudCrafter.Agent.Models.Recipe;
using MediatR;

namespace CloudCrafter.Agent.Console.Commands;

public static class GetDummyDeployment
{
    public record Query() : IRequest<DeploymentRecipe>;
    
    private class Handler : IRequestHandler<Query, DeploymentRecipe>
    {
        public Task<DeploymentRecipe> Handle(Query request, CancellationToken cancellationToken)
        {
            var recipe = new DeploymentRecipe
            {
                Name = "My Application",
                Destination = new DeploymentRecipeDestination { RootDirectory = "/root/directory" },
                Source = new DeploymentRecipeSource
                {
                    Git = new DeploymentSourceGit { Repository = "git@github.com:Thijmen/thijmen.dev.git", Commit = "HEAD" }
                }
            };


            return Task.FromResult(recipe);
        }
    }
}
