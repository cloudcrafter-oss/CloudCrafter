using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class CreateStackEnvironmentVariableCommand : IRequest<bool>
{
    public Guid StackId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
