using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine;
using MediatR;

namespace CloudCrafter.Agent.Console.Commands.Runner;

public static class CreateRunnerCommand
{
    public record Query(DeploymentRecipe recipe) : IRequest<RunnerEngine>;
    
    private class Handler : IRequestHandler<Query, RunnerEngine>
    {
        public Task<RunnerEngine> Handle(Query request, CancellationToken cancellationToken)
        {
            return Task.FromResult(new RunnerEngine(request.recipe));
        }
    }
}
