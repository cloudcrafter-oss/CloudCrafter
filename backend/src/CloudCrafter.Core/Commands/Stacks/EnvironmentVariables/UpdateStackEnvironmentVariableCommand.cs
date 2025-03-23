using CloudCrafter.Domain.Entities;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class UpdateStackEnvironmentVariableCommand : IRequest<bool>
{
    public Guid StackId { get; set; }
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public EnvironmentVariableType Type { get; set; } = EnvironmentVariableType.Both;
    public bool IsSecret { get; set; }
}
