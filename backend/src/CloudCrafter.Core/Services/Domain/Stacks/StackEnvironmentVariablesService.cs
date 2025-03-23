using System.Text.RegularExpressions;
using AutoMapper;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stacks;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StackEnvironmentVariablesService(
    IStackRepository repository,
    ILogger<StackEnvironmentVariablesService> logger
) : IStackEnvironmentVariablesService
{
    public async Task<List<StackEnvironmentVariableDto>> GetEnvironmentVariables(
        Guid stackId,
        bool includeInherited = false,
        bool includeSecrets = false
    )
    {
        try
        {
            var stack = await repository.GetStack(stackId);

            if (stack == null)
            {
                logger.LogWarning("Stack with id {StackId} not found", stackId);
                return new List<StackEnvironmentVariableDto>();
            }

            var result = stack
                .EnvironmentVariables.Select(ev => MapToDto(ev, includeSecrets, false))
                .ToList();

            // Include inherited variables if requested
            if (includeInherited && stack.Environment != null)
            {
                // TODO: Implement inherited variables retrieval when environment variables are added
                logger.LogInformation("Inherited variables support is not yet implemented");
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error retrieving environment variables for stack {StackId}",
                stackId
            );
            throw;
        }
    }

    public async Task CreateEnvironmentVariable(
        Guid stackId,
        string key,
        string value,
        bool isSecret = false,
        EnvironmentVariableType type = EnvironmentVariableType.Both
    )
    {
        // Validate stack exists
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw StackValidations.Create(StackValidations.StackNotFound);
        }

        // Create the environment variable
        var variable = new StackEnvironmentVariable
        {
            Id = Guid.NewGuid(),
            StackId = stackId,
            Key = key,
            Value = value,
            Type = type,
            IsSecret = isSecret,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        // Add the variable to the context first
        await repository.AddEnvironmentVariable(variable);
        await repository.SaveChangesAsync();
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
            var stack = await repository.GetStack(stackId);

            if (stack == null)
            {
                logger.LogWarning("Stack with id {StackId} not found", stackId);
                return false;
            }

            // Find the variable to update
            var variable = stack.EnvironmentVariables.FirstOrDefault(v => v.Id == id);

            if (variable == null)
            {
                logger.LogWarning(
                    "Environment variable with id {Id} not found for stack {StackId}",
                    id,
                    stackId
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
                    logger.LogWarning(
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

            await repository.SaveChangesAsync();

            // Add to history record
            logger.LogInformation(
                "Environment variable history: Stack {StackId}, Variable {Key}, Change {ChangeType}, "
                    + "Old Value: {OldValue}, New Value: {NewValue}",
                stackId,
                key,
                "Updated",
                variable.IsSecret ? "[HIDDEN]" : oldValue,
                variable.IsSecret ? "[HIDDEN]" : value
            );

            logger.LogInformation(
                "Updated environment variable from {OldKey} to {NewKey} for stack {StackId}",
                oldKey,
                key,
                stackId
            );

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(
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
            var stack = await repository.GetStack(stackId);

            if (stack == null)
            {
                logger.LogWarning("Stack with id {StackId} not found", stackId);
                return false;
            }

            // Find the variable to delete
            var variable = stack.EnvironmentVariables.FirstOrDefault(v => v.Id == id);

            if (variable == null)
            {
                logger.LogWarning(
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
            logger.LogInformation(
                "Environment variable history: Stack {StackId}, Variable {Key}, Change {ChangeType}, "
                    + "Old Value: {OldValue}, New Value: {NewValue}",
                stackId,
                key,
                "Deleted",
                isSecret ? "[HIDDEN]" : value,
                null
            );

            await repository.SaveChangesAsync();

            logger.LogInformation(
                "Deleted environment variable {Key} from stack {StackId}",
                key,
                stackId
            );

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(
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
            var stack = await repository.GetStack(stackId);

            if (stack == null)
            {
                logger.LogWarning("Stack with id {StackId} not found", stackId);
                return 0;
            }

            // Implement template application logic here
            // For now, return 0 as this is not yet implemented
            logger.LogWarning("Template application is not yet implemented");
            return 0;
        }
        catch (Exception ex)
        {
            logger.LogError(
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
            var stack = await repository.GetStack(stackId);

            if (stack == null)
            {
                logger.LogWarning("Stack with id {StackId} not found", stackId);
                return new List<StackEnvironmentVariableHistoryDto>();
            }

            // Implement history retrieval logic here
            // For now, return empty list as this depends on a history table that isn't set up yet
            logger.LogWarning("Environment variable history retrieval is not yet implemented");
            return new List<StackEnvironmentVariableHistoryDto>();
        }
        catch (Exception ex)
        {
            logger.LogError(
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
