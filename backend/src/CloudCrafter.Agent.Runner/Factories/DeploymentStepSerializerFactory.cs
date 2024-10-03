using System.Reflection;
using System.Text.Json;
using CloudCrafter.Agent.Models;
using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.Factories;

public class DeploymentStepSerializerFactory
{
    private readonly Dictionary<DeploymentBuildStepType, Type> _stepTypeToParamType;
    private readonly IDeploymentStepFactory _factory;
    private readonly ILogger<DeploymentStepSerializerFactory> _logger;

    public DeploymentStepSerializerFactory(
        IDeploymentStepFactory factory,
        ILogger<DeploymentStepSerializerFactory> logger
    )
    {
        var assembly = typeof(IAgentModelsTarget).Assembly;
        _stepTypeToParamType = assembly
            .GetTypes()
            .Where(t => t.GetCustomAttribute<DeploymentStepAttribute>() != null)
            .ToDictionary(t => t.GetCustomAttribute<DeploymentStepAttribute>()!.StepType, t => t);
        _factory = factory;
        _logger = logger;
    }

    public Type GetParamType(DeploymentBuildStepType stepType)
    {
        return _stepTypeToParamType[stepType];
    }

    public IDeploymentStepConfig<TParams> GetConfig<TParams>(DeploymentBuildStep step)
    {
        var config = _factory.GetConfig<TParams>(step.Type);

        return config;
    }

    public IDeploymentStepHandler<TParams> CreateHandler<TParams>(DeploymentBuildStep step)
    {
        return _factory.CreateHandler<TParams>(step.Type);
    }

    public TParams ConvertAndValidateParams<TParams>(
        Dictionary<string, object> parameters,
        IValidator<TParams> validator
    )
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
}
