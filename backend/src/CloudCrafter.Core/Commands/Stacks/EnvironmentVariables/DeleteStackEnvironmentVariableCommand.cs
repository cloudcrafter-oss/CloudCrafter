using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class DeleteStackEnvironmentVariableCommand(Guid stackId, Guid id) : IRequest<bool>
{
    public Guid StackId { get; set; } = stackId;
    public Guid Id { get; set; } = id;
}
