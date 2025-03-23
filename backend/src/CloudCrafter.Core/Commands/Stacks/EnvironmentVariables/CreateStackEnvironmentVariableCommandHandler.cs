using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class CreateStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<CreateStackEnvironmentVariableCommand, bool>
{
    public async Task<bool> Handle(
        CreateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        await environmentVariablesService.CreateEnvironmentVariable(
            request.StackId,
            request.Key,
            request.Value
        );

        return true;
    }
}
