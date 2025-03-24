using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Entities;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

/// <summary>
///     Command to create a new environment variable group for a stack
/// </summary>
[Authorize]
public record CreateStackEnvironmentVariableGroupCommand : IRequest<Guid>
{
    /// <summary>
    ///     ID of the stack to create the environment variable group for
    /// </summary>
    [JsonIgnore]
    public Guid StackId { get; set; }

    /// <summary>
    ///     Name of the environment variable group
    /// </summary>
    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    /// <summary>
    ///     Description of the environment variable group
    /// </summary>
    [MaxLength(500)]
    public string? Description { get; set; }
}

public class CreateStackEnvironmentVariableGroupCommandHandler(
    IStackEnvironmentVariablesService stackEnvironmentVariablesService
) : IRequestHandler<CreateStackEnvironmentVariableGroupCommand, Guid>
{
    public async Task<Guid> Handle(
        CreateStackEnvironmentVariableGroupCommand request,
        CancellationToken cancellationToken
    )
    {
        // Use the service to add the group
        var groupId = await stackEnvironmentVariablesService.CreateEnvironmentVariableGroup(
            request.StackId,
            request.Name,
            request.Description
        );

        return groupId;
    }
}
