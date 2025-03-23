using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class UpdateStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<UpdateStackEnvironmentVariableCommand, Guid>
{
    public async Task<Guid> Handle(
        UpdateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        var result = await environmentVariablesService.UpdateEnvironmentVariable(
            request.Id,
            request.StackId,
            request.Key,
            request.Value
        );

        return result;
    }
}
