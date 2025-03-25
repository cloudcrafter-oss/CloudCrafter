using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record UpdateStackEnvironmentVariableGroupCommand
    : CreateStackEnvironmentVariableGroupBaseCommand,
        IRequest
{
    [JsonIgnore]
    public Guid Id { get; set; }
}
