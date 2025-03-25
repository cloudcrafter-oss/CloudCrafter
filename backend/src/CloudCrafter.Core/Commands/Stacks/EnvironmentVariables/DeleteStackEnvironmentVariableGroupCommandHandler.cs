using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

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
