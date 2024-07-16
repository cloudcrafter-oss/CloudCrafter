using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using MediatR;

namespace CloudCrafter.Agent.Runner.MediatR.Commands;

public static class ExecuteBuildStepCommand
{
    public record Query(DeploymentBuildStep Step, DeploymentContext Context) : IRequest;
    
    private class Handler(IDeploymentStepFactory factory) : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            var step = factory.CreateStep(request.Step.Type);

            await step.ExecuteAsync(request.Step, request.Context);
        }
    }
}
