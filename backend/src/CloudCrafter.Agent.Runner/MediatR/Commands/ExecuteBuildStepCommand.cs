using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Factories;
using MediatR;

namespace CloudCrafter.Agent.Runner.MediatR.Commands;

public static class ExecuteBuildStepCommand
{
    public record Query(DeploymentBuildStep Step, DeploymentContext Context) : IRequest;

    private class Handler : IRequestHandler<Query>
    {
        private readonly DeploymentStepSerializerFactory _serializerFactory;

        public Handler(DeploymentStepSerializerFactory serializerFactory)
        {
            _serializerFactory = serializerFactory;
        }

        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            var paramType = _serializerFactory.GetParamType(request.Step.Type);
            var method = typeof(Handler).GetMethod(
                nameof(ExecuteStepInternal),
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance
            );

            if (method == null)
            {
                throw new ArgumentException("Method not found");
            }

            var genericMethod = method.MakeGenericMethod(paramType);
            await (Task)genericMethod.Invoke(this, new object[] { request.Step, request.Context })!;
        }

        private async Task ExecuteStepInternal<TParams>(
            DeploymentBuildStep step,
            DeploymentContext context
        )
            where TParams : BaseParams
        {
            var handler = _serializerFactory.GetHandler<TParams>(step);
            var paramObject = _serializerFactory.ConvertAndValidateParams(
                step.Params,
                handler.Validator
            );

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
