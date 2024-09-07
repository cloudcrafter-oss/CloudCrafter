using System.Reflection;
using System.Text.Json;
using CloudCrafter.Agent.Models;
using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Factories;

public class DeploymentStepSerializerFactory
{
    private readonly Dictionary<DeploymentBuildStepType, Type> _stepTypeToParamType;
    private readonly IDeploymentStepFactory _factory;

    public DeploymentStepSerializerFactory(IDeploymentStepFactory factory)
    {
        var assembly = typeof(IAgentModelsTarget).Assembly;
        _stepTypeToParamType = assembly
            .GetTypes()
            .Where(t => t.GetCustomAttribute<DeploymentStepAttribute>() != null)
            .ToDictionary(
                t => t.GetCustomAttribute<DeploymentStepAttribute>()!.StepType,
                t => t
            );
        _factory = factory;
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
    
    public TParams ConvertAndValidateParams<TParams>(Dictionary<string, object> parameters,
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
