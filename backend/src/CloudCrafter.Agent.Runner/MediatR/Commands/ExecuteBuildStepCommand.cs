using System.Reflection;
using System.Text.Json;
using CloudCrafter.Agent.Models;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;
using MediatR;

namespace CloudCrafter.Agent.Runner.MediatR.Commands;

public static class ExecuteBuildStepCommand
{
    public record Query(DeploymentBuildStep Step, DeploymentContext Context) : IRequest;

    private class Handler(IDeploymentStepFactory factory, DeploymentStepSerializerFactory serializerFactory) : IRequestHandler<Query>
    {
        
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            var paramType = serializerFactory.GetParamType(request.Step.Type);
            var method = typeof(Handler).GetMethod(nameof(ExecuteStepInternal),
                BindingFlags.NonPublic | BindingFlags.Instance);

            if (method == null)
            {
                throw new ArgumentException("Method not found");
            }

            var genericMethod = method.MakeGenericMethod(paramType);

            await (Task)genericMethod.Invoke(this, new object[] { request.Step, request.Context })!;
        }


        private async Task ExecuteStepInternal<TParams>(DeploymentBuildStep step, DeploymentContext context)
        {
            var config = factory.GetConfig<TParams>(step.Type);
            var handler = factory.CreateHandler<TParams>(step.Type);

            var paramObject = serializerFactory.ConvertAndValidateParams(step.Params, config.Validator);
            if (context.IsDryRun)
            {
                await handler.DryRun(paramObject, context);
            }
            else
            {
                await handler.ExecuteAsync(paramObject, context);
            }
        }
    }
}
