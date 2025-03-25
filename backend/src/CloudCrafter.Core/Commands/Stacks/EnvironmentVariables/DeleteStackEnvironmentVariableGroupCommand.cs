using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record DeleteStackEnvironmentVariableGroupCommand(Guid StackId, Guid Id) : IRequest;

public class DeleteStackEnvironmentVariableGroupCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<DeleteStackEnvironmentVariableGroupCommand>
{
    public async Task Handle(
        DeleteStackEnvironmentVariableGroupCommand request,
        CancellationToken cancellationToken
    )
    {
        await environmentVariablesService.DeleteEnvironmentVariableGroup(
            request.Id,
            request.StackId
        );
    }
}
