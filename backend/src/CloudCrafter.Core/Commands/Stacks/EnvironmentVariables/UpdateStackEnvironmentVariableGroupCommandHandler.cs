using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class UpdateStackEnvironmentVariableGroupCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<UpdateStackEnvironmentVariableGroupCommand>
{
    public async Task Handle(
        UpdateStackEnvironmentVariableGroupCommand request,
        CancellationToken cancellationToken
    )
    {
        await environmentVariablesService.UpdateEnvironmentVariableGroup(
            request.Id,
            request.StackId,
            request.Name,
            request.Description
        );
    }
}
