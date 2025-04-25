using AutoMapper;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stacks;
using CloudCrafter.Domain.Domain.User.ACL;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;
using NotFoundException = Ardalis.GuardClauses.NotFoundException;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StackEnvironmentVariablesService(
    IStackRepository repository,
    ILogger<StackEnvironmentVariablesService> logger,
    IMapper mapper,
    IUser user,
    IUserAccessService accessService
) : IStackEnvironmentVariablesService
{
    public async Task<List<StackEnvironmentVariableDto>> GetEnvironmentVariables(
        Guid stackId,
        bool includeSecrets = false
    )
    {
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw new NotFoundException("Stack", "Stack not found");
        }

        await accessService.EnsureHasAccessToEntity(
            stack.Environment.Project,
            user?.Id,
            AccessType.Read
        );

        var environmentVariables = await repository.GetEnvironmentVariables(stackId);

        return mapper.Map<List<StackEnvironmentVariableDto>>(
            environmentVariables,
            opt => opt.Items["IncludeSecrets"] = includeSecrets
        );
    }

    public async Task CreateDefaultVariableGroups(Guid stackId)
    {
        // Validate stack exists
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            return;
        }

        // Create default variable groups
        var groups = new List<StackEnvironmentVariableGroup>
        {
            new()
            {
                Id = Guid.NewGuid(),
                StackId = stackId,
                Name = "Application Settings",
                Description = "Basic application environment variables",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            },
            new()
            {
                Id = Guid.NewGuid(),
                StackId = stackId,
                Name = "Database Settings",
                Description = "Database connection environment variables",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            },
        };

        // Add the groups to the context
        await repository.AddEnvironmentVariableGroups(groups);
        await repository.SaveChangesAsync();
    }

    public async Task<Guid> CreateEnvironmentVariableGroup(StackEnvironmentVariableGroup group)
    {
        // Validate stack exists
        var stack = await repository.GetStack(group.StackId);

        if (stack == null)
        {
            throw new NotFoundException("Stack", "Stack not found");
        }

        // Add the group to the repository
        var groups = new List<StackEnvironmentVariableGroup> { group };
        try
        {
            await repository.AddEnvironmentVariableGroups(groups);
            await repository.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is PostgresException { SqlState: "23505" })
        {
            throw StackValidations.Create(StackValidations.EnvironmentVariableGroupNotUnique);
        }

        return group.Id;
    }

    public async Task<Guid> CreateEnvironmentVariableGroup(
        Guid stackId,
        string name,
        string? description
    )
    {
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw new NotFoundException("Stack", "Stack not found");
        }

        await accessService.EnsureHasAccessToEntity(
            stack.Environment.Project,
            user?.Id,
            AccessType.Write
        );

        // Create a new environment variable group entity
        var group = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stackId,
            Name = name,
            Description = description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        // Use the existing method to add the group
        return await CreateEnvironmentVariableGroup(group);
    }

    public async Task<List<StackEnvironmentVariableGroupDto>> GetEnvironmentVariableGroups(
        Guid stackId
    )
    {
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw new NotFoundException("Stack", "Stack not found");
        }

        await accessService.EnsureHasAccessToEntity(
            stack.Environment.Project,
            user?.Id,
            AccessType.Read
        );

        // Get the variable groups for the stack
        var groups = await repository.GetEnvironmentVariableGroups(stackId);

        if (!groups.Any())
        {
            logger.LogWarning("No environment variable groups found for stack {StackId}", stackId);
            return new List<StackEnvironmentVariableGroupDto>();
        }

        // Map groups to DTOs
        return mapper.Map<List<StackEnvironmentVariableGroupDto>>(groups);
    }

    public async Task<Guid> CreateEnvironmentVariable(
        Guid stackId,
        string key,
        string value,
        bool isSecret = false,
        EnvironmentVariableType type = EnvironmentVariableType.Both,
        Guid? groupId = null
    )
    {
        // Validate stack exists
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw StackValidations.Create(StackValidations.StackNotFound);
        }

        var project = stack.Environment.Project;

        await accessService.EnsureHasAccessToEntity(project, user?.Id, AccessType.Write);

        if (groupId.HasValue)
        {
            var group = await repository.GetEnvironmentVariableGroup(stackId, groupId.Value);

            if (group == null)
            {
                throw StackValidations.Create(StackValidations.EnvironmentVariableGroupNotFound);
            }
        }

        // Create the environment variable
        var variable = new StackEnvironmentVariable
        {
            Id = Guid.NewGuid(),
            StackId = stackId,
            GroupId = groupId,
            Key = key,
            Value = value,
            Type = type,
            IsSecret = isSecret,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        // Add the variable to the context first
        try
        {
            await repository.AddEnvironmentVariable(variable);

            await repository.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is PostgresException { SqlState: "23505" })
        {
            throw StackValidations.Create(StackValidations.EnvironmentVariableNotUnique);
        }

        return variable.Id;
    }

    public async Task<Guid> UpdateEnvironmentVariable(
        Guid id,
        Guid stackId,
        string key,
        string value,
        bool? isSecret = null,
        EnvironmentVariableType? type = null,
        Guid? groupId = null
    )
    {
        // Get the stack
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw StackValidations.Create(StackValidations.StackNotFound);
        }

        // Find the variable to update
        var variable = stack.EnvironmentVariables.FirstOrDefault(v => v.Id == id);

        if (variable == null)
        {
            throw StackValidations.Create(StackValidations.EnvironmentVariableNotFound);
        }

        // Update the variable
        variable.Key = key;
        variable.Value = value;
        variable.GroupId = groupId;

        if (isSecret.HasValue)
        {
            variable.IsSecret = isSecret.Value;
        }

        if (type.HasValue)
        {
            variable.Type = type.Value;
        }

        try
        {
            await repository.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is PostgresException { SqlState: "23505" })
        {
            throw StackValidations.Create(StackValidations.EnvironmentVariableNotUnique);
        }

        return variable.Id;
    }

    public async Task DeleteEnvironmentVariable(Guid id, Guid stackId)
    {
        // Get the stack
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw new NotFoundException("Stack", "Stack not found");
        }

        await accessService.EnsureHasAccessToEntity(
            stack.Environment.Project,
            user?.Id,
            AccessType.Write
        );

        // Find the variable to update
        var variable = stack.EnvironmentVariables.FirstOrDefault(v => v.Id == id);

        if (variable == null)
        {
            throw new NotFoundException("EnvironmentVariable", "Environment variable not found");
        }

        // Remove the variable
        stack.EnvironmentVariables.Remove(variable);

        await repository.SaveChangesAsync();
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

    public async Task UpdateEnvironmentVariableGroup(
        Guid id,
        Guid stackId,
        string name,
        string? description
    )
    {
        // Get the environment variable group directly from repository
        var existingGroup = await repository.GetEnvironmentVariableGroup(stackId, id);

        if (existingGroup == null)
        {
            throw new NotFoundException(
                "EnvironmentVariableGroup",
                $"Group with id {id} not found"
            );
        }

        // Update the group properties
        existingGroup.Name = name;
        existingGroup.Description = description;
        existingGroup.UpdatedAt = DateTime.UtcNow;

        // Save changes
        try
        {
            await repository.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is PostgresException { SqlState: "23505" })
        {
            throw StackValidations.Create(StackValidations.EnvironmentVariableGroupNotUnique);
        }
    }

    public async Task DeleteEnvironmentVariableGroup(Guid id, Guid stackId)
    {
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw new NotFoundException("Stack", "Stack not found");
        }

        await accessService.EnsureHasAccessToEntity(
            stack.Environment.Project,
            user?.Id,
            AccessType.Write
        );

        // Get the group directly from repository
        var group = await repository.GetEnvironmentVariableGroup(stackId, id);

        if (group == null)
        {
            throw new NotFoundException(
                "EnvironmentVariableGroup",
                $"Group with id {id} not found"
            );
        }

        // Remove the group from the repository
        repository.RemoveEnvironmentVariableGroup(group);

        // Save changes
        await repository.SaveChangesAsync();
    }
}
