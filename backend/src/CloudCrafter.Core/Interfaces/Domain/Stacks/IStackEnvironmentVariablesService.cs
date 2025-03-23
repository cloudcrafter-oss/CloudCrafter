using CloudCrafter.Domain.Domain.Stacks;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Domain.Stacks;

public interface IStackEnvironmentVariablesService
{
    /// <summary>
    ///     Retrieves all environment variables for a stack
    /// </summary>
    /// <param name="stackId">ID of the stack</param>
    /// <param name="includeInherited">Whether to include variables inherited from the environment</param>
    /// <param name="includeSecrets">Whether to include the actual values of secret variables</param>
    /// <returns>List of environment variables</returns>
    Task<List<StackEnvironmentVariableDto>> GetEnvironmentVariables(
        Guid stackId,
        bool includeInherited = false,
        bool includeSecrets = false
    );

    /// <summary>
    ///     Creates a new environment variable for a stack
    /// </summary>
    /// <param name="stackId">ID of the stack</param>
    /// <param name="key">Environment variable key</param>
    /// <param name="value">Environment variable value</param>
    /// <param name="isSecret">Whether the variable is a secret</param>
    /// <param name="type">Type of environment variable (BuildTime, Runtime, Both)</param>
    /// <returns>True if successfully created, false otherwise</returns>
    Task<Guid> CreateEnvironmentVariable(
        Guid stackId,
        string key,
        string value,
        bool isSecret = false,
        EnvironmentVariableType type = EnvironmentVariableType.Both
    );

    /// <summary>
    ///     Updates an existing environment variable
    /// </summary>
    /// <param name="id">ID of the environment variable</param>
    /// <param name="stackId">ID of the stack</param>
    /// <param name="key">New environment variable key</param>
    /// <param name="value">New environment variable value</param>
    /// <param name="isSecret">Whether the variable is a secret</param>
    /// <param name="type">Type of environment variable (BuildTime, Runtime, Both)</param>
    /// <returns>True if successfully updated, false otherwise</returns>
    Task<bool> UpdateEnvironmentVariable(
        Guid id,
        Guid stackId,
        string key,
        string value,
        bool? isSecret = null,
        EnvironmentVariableType? type = null
    );

    /// <summary>
    ///     Deletes an environment variable
    /// </summary>
    /// <param name="id">ID of the environment variable</param>
    /// <param name="stackId">ID of the stack</param>
    /// <returns>True if successfully deleted, false otherwise</returns>
    Task<bool> DeleteEnvironmentVariable(Guid id, Guid stackId);

    /// <summary>
    ///     Applies a template of environment variables to a stack
    /// </summary>
    /// <param name="stackId">ID of the stack</param>
    /// <param name="templateId">ID of the template to apply</param>
    /// <param name="overrideExisting">Whether to override existing variables</param>
    /// <returns>Number of variables created or updated</returns>
    Task<int> ApplyTemplate(Guid stackId, Guid templateId, bool overrideExisting = false);

    /// <summary>
    ///     Gets the version history of environment variables for a stack
    /// </summary>
    /// <param name="stackId">ID of the stack</param>
    /// <param name="startDate">Optional start date for filtering</param>
    /// <param name="endDate">Optional end date for filtering</param>
    /// <returns>List of environment variable history entries</returns>
    Task<List<StackEnvironmentVariableHistoryDto>> GetHistory(
        Guid stackId,
        DateTime? startDate = null,
        DateTime? endDate = null
    );
}
