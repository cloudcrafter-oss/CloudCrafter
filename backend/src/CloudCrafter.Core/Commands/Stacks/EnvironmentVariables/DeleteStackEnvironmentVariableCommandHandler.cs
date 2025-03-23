using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class DeleteStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService,
    ILogger<DeleteStackEnvironmentVariableCommandHandler> logger
) : IRequestHandler<DeleteStackEnvironmentVariableCommand, bool>
{
    public async Task<bool> Handle(
        DeleteStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var result = await environmentVariablesService.DeleteEnvironmentVariable(
                request.Id,
                request.StackId
            );

            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error deleting environment variable {Id} for stack {StackId}",
                request.Id,
                request.StackId
            );
            return false;
        }
    }
}
