using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Domain.Entities;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record UpdateStackEnvironmentVariableCommand
    : CreateStackEnvironmentVariableCommand,
        IRequest<Guid>
{
    [JsonIgnore]
    public Guid Id { get; set; }
}
