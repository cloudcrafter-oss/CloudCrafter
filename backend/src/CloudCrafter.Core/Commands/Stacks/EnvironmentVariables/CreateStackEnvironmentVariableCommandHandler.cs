using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class CreateStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService,
    ILogger<CreateStackEnvironmentVariableCommandHandler> logger
) : IRequestHandler<CreateStackEnvironmentVariableCommand, bool>
{
    public async Task<bool> Handle(
        CreateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var result = await environmentVariablesService.CreateEnvironmentVariable(
                request.StackId,
                request.Key,
                request.Value
            );

            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error creating environment variable for stack {StackId}",
                request.StackId
            );
            return false;
        }
    }
}
