using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class UpdateStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService,
    ILogger<UpdateStackEnvironmentVariableCommandHandler> logger
) : IRequestHandler<UpdateStackEnvironmentVariableCommand, bool>
{
    public async Task<bool> Handle(
        UpdateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var result = await environmentVariablesService.UpdateEnvironmentVariable(
                request.Id,
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
                "Error updating environment variable {Id} for stack {StackId}",
                request.Id,
                request.StackId
            );
            return false;
        }
    }
}
