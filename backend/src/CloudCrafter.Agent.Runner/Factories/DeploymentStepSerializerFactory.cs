using System.Text.Json;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.Factories;

public class DeploymentStepSerializerFactory
{
    private readonly IDeploymentStepFactory _factory;
    private readonly ILogger<DeploymentStepSerializerFactory> _logger;

    public DeploymentStepSerializerFactory(
        IDeploymentStepFactory factory,
        ILogger<DeploymentStepSerializerFactory> logger
    )
    {
        _factory = factory;
        _logger = logger;
    }

    public Type GetParamType(DeploymentBuildStepType stepType)
    {
        return _factory.GetParamType(stepType);
    }

    public TParams ConvertAndValidateParams<TParams>(
        Dictionary<string, object> parameters,
        IValidator<TParams> validator
    )
        where TParams : BaseParams
    {
        var jsonString = JsonSerializer.Serialize(parameters);

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true,
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
            _logger.LogCritical("Validation failed type {0}", validator.GetType().Name);
            throw new ValidationException(validationResult.Errors);
        }

        return paramObject;
    }

    public IDeploymentStep<TParams> GetHandler<TParams>(DeploymentBuildStep step)
        where TParams : BaseParams
    {
        return _factory.CreateHandler<TParams>(step.Type);
    }
}
