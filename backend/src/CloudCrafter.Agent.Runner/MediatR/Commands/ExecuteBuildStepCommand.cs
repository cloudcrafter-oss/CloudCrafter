using System.Reflection;
using System.Text.Json;
using CloudCrafter.Agent.Models;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;
using MediatR;

namespace CloudCrafter.Agent.Runner.MediatR.Commands;

public static class ExecuteBuildStepCommand
{
    public record Query(DeploymentBuildStep Step, DeploymentContext Context) : IRequest;

    private class Handler(IDeploymentStepFactory factory) : IRequestHandler<Query>
    {
        private static readonly Dictionary<DeploymentBuildStepType, Type> _stepTypeToParamType;

        static Handler()
        {
            var assembly = typeof(IAgentModelsTarget).Assembly;
            _stepTypeToParamType = assembly
                .GetTypes()
                .Where(t => t.GetCustomAttribute<DeploymentStepAttribute>() != null)
                .ToDictionary(
                    t => t.GetCustomAttribute<DeploymentStepAttribute>()!.StepType,
                    t => t
                );
        }


        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            var paramType = _stepTypeToParamType[request.Step.Type];
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

            var paramObject = ConvertAndValidateParams(step.Params, config.Validator);
            if (context.IsDryRun)
            {
                await handler.DryRun(paramObject, context);
            }
            else
            {
                await handler.ExecuteAsync(paramObject, context);
            }
        }

        private TParams ConvertAndValidateParams<TParams>(Dictionary<string, object> parameters,
            IValidator<TParams> validator)
        {
            var jsonString = JsonSerializer.Serialize(parameters);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase, WriteIndented = true
            };

            // Deserialize JSON string to TParams object
            var paramObject = JsonSerializer.Deserialize<TParams>(jsonString, options);

            if (paramObject == null)
            {
                throw new ArgumentException("Failed to deserialize parameters");
            }

            var validationResult = validator.Validate(paramObject);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            return paramObject;
        }
    }
}
