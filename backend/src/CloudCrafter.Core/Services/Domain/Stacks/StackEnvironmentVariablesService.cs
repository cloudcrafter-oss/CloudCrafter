using System.Text.RegularExpressions;
using AutoMapper;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stacks;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StackEnvironmentVariablesService : IStackEnvironmentVariablesService
{
    private readonly IStackRepository _repository;
    private readonly ILogger<StackEnvironmentVariablesService> _logger;
    private readonly IMapper _mapper;
    private static readonly Regex KeyRegex = new Regex("^[A-Z][A-Z0-9_]*$", RegexOptions.Compiled);

    public StackEnvironmentVariablesService(
        IStackRepository repository,
        ILogger<StackEnvironmentVariablesService> logger,
        IMapper mapper
    )
    {
        _repository = repository;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<List<StackEnvironmentVariableDto>> GetEnvironmentVariables(
        Guid stackId,
        bool includeInherited = false,
        bool includeSecrets = false
    )
    {
        try
        {
            var stack = await _repository.GetStack(stackId);

            if (stack == null)
            {
                _logger.LogWarning("Stack with id {StackId} not found", stackId);
                return new List<StackEnvironmentVariableDto>();
            }

            var result = stack
                .EnvironmentVariables.Select(ev => MapToDto(ev, includeSecrets, false))
                .ToList();

            // Include inherited variables if requested
            if (includeInherited && stack.Environment != null)
            {
                // TODO: Implement inherited variables retrieval when environment variables are added
                _logger.LogInformation("Inherited variables support is not yet implemented");
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error retrieving environment variables for stack {StackId}",
                stackId
            );
            throw;
        }
    }

    public async Task<bool> CreateEnvironmentVariable(
        Guid stackId,
        string key,
        string value,
        bool isSecret = false,
        EnvironmentVariableType type = EnvironmentVariableType.Both
    )
    {
        try
        {
            // Validate stack exists
            var stack = await _repository.GetStack(stackId);

            if (stack == null)
            {
                _logger.LogWarning("Stack with id {StackId} not found", stackId);
                return false;
            }

            // Validate key format
            if (!KeyRegex.IsMatch(key))
            {
                _logger.LogWarning("Invalid environment variable key format: {Key}", key);
                return false;
            }

            // Validate key length
            if (key.Length > 100)
            {
                _logger.LogWarning(
                    "Environment variable key exceeds maximum length: {KeyLength}",
                    key.Length
                );
                return false;
            }

            // Validate value length
            if (value.Length > 2000)
            {
                _logger.LogWarning(
                    "Environment variable value exceeds maximum length: {ValueLength}",
                    value.Length
                );
                return false;
            }

            // Check for duplicate key
            var existingVar = stack.EnvironmentVariables.FirstOrDefault(v => v.Key == key);

            if (existingVar != null)
            {
                _logger.LogWarning(
                    "Environment variable with key {Key} already exists for stack {StackId}",
                    key,
                    stackId
                );
                return false;
            }

            // Auto-detect secrets if not explicitly set
            if (!isSecret)
            {
                isSecret =
                    key.Contains("SECRET") || key.Contains("PASSWORD") || key.Contains("KEY");
            }

            // Create the environment variable
            var variable = new StackEnvironmentVariable
            {
                Id = Guid.NewGuid(),
                StackId = stackId,
                Stack = stack,
                Key = key,
                Value = value,
                Type = type,
                IsSecret = isSecret,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            stack.EnvironmentVariables.Add(variable);
            await _repository.SaveChangesAsync();

            // Add to history record
            _logger.LogInformation(
                "Environment variable history: Stack {StackId}, Variable {Key}, Change {ChangeType}, "
                    + "Old Value: {OldValue}, New Value: {NewValue}",
                stackId,
                key,
                "Created",
                null,
                isSecret ? "[HIDDEN]" : value
            );

            _logger.LogInformation(
                "Created environment variable {Key} for stack {StackId}",
                key,
                stackId
            );

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error creating environment variable for stack {StackId}",
                stackId
            );
            return false;
        }
    }

    public async Task<bool> UpdateEnvironmentVariable(
        Guid id,
        Guid stackId,
        string key,
        string value,
        bool? isSecret = null,
        EnvironmentVariableType? type = null
    )
    {
        try
        {
            // Get the stack
            var stack = await _repository.GetStack(stackId);

            if (stack == null)
            {
                _logger.LogWarning("Stack with id {StackId} not found", stackId);
                return false;
            }

            // Find the variable to update
            var variable = stack.EnvironmentVariables.FirstOrDefault(v => v.Id == id);

            if (variable == null)
            {
                _logger.LogWarning(
                    "Environment variable with id {Id} not found for stack {StackId}",
                    id,
                    stackId
                );
                return false;
            }

            // Validate key format
            if (!KeyRegex.IsMatch(key))
            {
                _logger.LogWarning("Invalid environment variable key format: {Key}", key);
                return false;
            }

            // Validate key length
            if (key.Length > 100)
            {
                _logger.LogWarning(
                    "Environment variable key exceeds maximum length: {KeyLength}",
                    key.Length
                );
                return false;
            }

            // Validate value length
            if (value.Length > 2000)
            {
                _logger.LogWarning(
                    "Environment variable value exceeds maximum length: {ValueLength}",
                    value.Length
                );
                return false;
            }

            // If key is changed, check for duplicates
            if (key != variable.Key)
            {
                var existingVar = stack.EnvironmentVariables.FirstOrDefault(v =>
                    v.Key == key && v.Id != id
                );

                if (existingVar != null)
                {
                    _logger.LogWarning(
                        "Environment variable with key {Key} already exists for stack {StackId}",
                        key,
                        stackId
                    );
                    return false;
                }
            }

            // Record old values for history tracking
            var oldKey = variable.Key;
            var oldValue = variable.Value;

            // Update the variable
            variable.Key = key;
            variable.Value = value;
            variable.UpdatedAt = DateTime.UtcNow;

            if (isSecret.HasValue)
            {
                variable.IsSecret = isSecret.Value;
            }
            else if (key != oldKey)
            {
                // Auto-detect secrets if key changed and isSecret not explicitly set
                variable.IsSecret =
                    key.Contains("SECRET") || key.Contains("PASSWORD") || key.Contains("KEY");
            }

            if (type.HasValue)
            {
                variable.Type = type.Value;
            }

            await _repository.SaveChangesAsync();

            // Add to history record
            _logger.LogInformation(
                "Environment variable history: Stack {StackId}, Variable {Key}, Change {ChangeType}, "
                    + "Old Value: {OldValue}, New Value: {NewValue}",
                stackId,
                key,
                "Updated",
                variable.IsSecret ? "[HIDDEN]" : oldValue,
                variable.IsSecret ? "[HIDDEN]" : value
            );

            _logger.LogInformation(
                "Updated environment variable from {OldKey} to {NewKey} for stack {StackId}",
                oldKey,
                key,
                stackId
            );

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error updating environment variable {Id} for stack {StackId}",
                id,
                stackId
            );
            return false;
        }
    }

    public async Task<bool> DeleteEnvironmentVariable(Guid id, Guid stackId)
    {
        try
        {
            // Get the stack
            var stack = await _repository.GetStack(stackId);

            if (stack == null)
            {
                _logger.LogWarning("Stack with id {StackId} not found", stackId);
                return false;
            }

            // Find the variable to delete
            var variable = stack.EnvironmentVariables.FirstOrDefault(v => v.Id == id);

            if (variable == null)
            {
                _logger.LogWarning(
                    "Environment variable with id {Id} not found for stack {StackId}",
                    id,
                    stackId
                );
                return false;
            }

            // Record details for history tracking
            var key = variable.Key;
            var value = variable.Value;
            var isSecret = variable.IsSecret;

            // Remove the variable
            stack.EnvironmentVariables.Remove(variable);

            // Add to history record before deleting
            _logger.LogInformation(
                "Environment variable history: Stack {StackId}, Variable {Key}, Change {ChangeType}, "
                    + "Old Value: {OldValue}, New Value: {NewValue}",
                stackId,
                key,
                "Deleted",
                isSecret ? "[HIDDEN]" : value,
                null
            );

            await _repository.SaveChangesAsync();

            _logger.LogInformation(
                "Deleted environment variable {Key} from stack {StackId}",
                key,
                stackId
            );

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error deleting environment variable {Id} for stack {StackId}",
                id,
                stackId
            );
            return false;
        }
    }

    public async Task<int> ApplyTemplate(
        Guid stackId,
        Guid templateId,
        bool overrideExisting = false
    )
    {
        try
        {
            // Check if stack exists
            var stack = await _repository.GetStack(stackId);

            if (stack == null)
            {
                _logger.LogWarning("Stack with id {StackId} not found", stackId);
                return 0;
            }

            // Implement template application logic here
            // For now, return 0 as this is not yet implemented
            _logger.LogWarning("Template application is not yet implemented");
            return 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error applying template {TemplateId} to stack {StackId}",
                templateId,
                stackId
            );
            return 0;
        }
    }

    public async Task<List<StackEnvironmentVariableHistoryDto>> GetHistory(
        Guid stackId,
        DateTime? startDate = null,
        DateTime? endDate = null
    )
    {
        try
        {
            // Check if stack exists
            var stack = await _repository.GetStack(stackId);

            if (stack == null)
            {
                _logger.LogWarning("Stack with id {StackId} not found", stackId);
                return new List<StackEnvironmentVariableHistoryDto>();
            }

            // Implement history retrieval logic here
            // For now, return empty list as this depends on a history table that isn't set up yet
            _logger.LogWarning("Environment variable history retrieval is not yet implemented");
            return new List<StackEnvironmentVariableHistoryDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error retrieving environment variable history for stack {StackId}",
                stackId
            );
            return new List<StackEnvironmentVariableHistoryDto>();
        }
    }

    // Helper methods
    private StackEnvironmentVariableDto MapToDto(
        StackEnvironmentVariable variable,
        bool includeSecrets,
        bool isInherited
    )
    {
        return new StackEnvironmentVariableDto
        {
            Id = variable.Id,
            StackId = variable.StackId,
            Key = variable.Key,
            // Mask value if it's a secret and secrets are not included
            Value = variable.IsSecret && !includeSecrets ? "[HIDDEN]" : variable.Value,
            IsSecret = variable.IsSecret,
            Type = variable.Type,
            CreatedAt = variable.CreatedAt,
            LastModifiedAt = variable.UpdatedAt,
            GroupName = null, // Add group support later
            IsInherited = isInherited,
        };
    }
}
