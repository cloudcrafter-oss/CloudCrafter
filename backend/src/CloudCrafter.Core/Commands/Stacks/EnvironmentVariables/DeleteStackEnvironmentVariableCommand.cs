using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public class DeleteStackEnvironmentVariableCommand(Guid stackId, Guid id) : IRequest
{
    public Guid StackId { get; set; } = stackId;
    public Guid Id { get; set; } = id;
}

public class DeleteStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<DeleteStackEnvironmentVariableCommand>
{
    public async Task Handle(
        DeleteStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        await environmentVariablesService.DeleteEnvironmentVariable(request.Id, request.StackId);
    }
}
