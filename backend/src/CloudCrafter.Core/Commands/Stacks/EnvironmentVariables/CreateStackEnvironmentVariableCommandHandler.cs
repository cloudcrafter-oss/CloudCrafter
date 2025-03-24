using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class CreateStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<CreateStackEnvironmentVariableCommand, Guid>
{
    public async Task<Guid> Handle(
        CreateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        var id = await environmentVariablesService.CreateEnvironmentVariable(
            request.StackId,
            request.Key,
            request.Value,
            request.IsSecret,
            request.Type
        );

        return id;
    }
}
