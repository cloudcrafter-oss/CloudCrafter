using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record UpdateStackEnvironmentVariableGroupCommand
    : CreateStackEnvironmentVariableGroupCommand
{
    [JsonIgnore]
    public Guid Id { get; set; }
}
