using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Domain.Entities;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record CreateStackEnvironmentVariableCommand : IRequest<bool>
{
    [JsonIgnore]
    public Guid StackId { get; set; }

    public required string Key { get; init; }
    public required string Value { get; init; }
    public required EnvironmentVariableType Type { get; init; }
    public required bool IsSecret { get; init; }
}
