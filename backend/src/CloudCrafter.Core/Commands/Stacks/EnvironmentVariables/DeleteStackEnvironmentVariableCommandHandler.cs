using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class DeleteStackEnvironmentVariableCommandHandler
    : IRequestHandler<DeleteStackEnvironmentVariableCommand, bool>
{
    private readonly IStackEnvironmentVariablesService _environmentVariablesService;
    private readonly ILogger<DeleteStackEnvironmentVariableCommandHandler> _logger;

    public DeleteStackEnvironmentVariableCommandHandler(
        IStackEnvironmentVariablesService environmentVariablesService,
        ILogger<DeleteStackEnvironmentVariableCommandHandler> logger
    )
    {
        _environmentVariablesService = environmentVariablesService;
        _logger = logger;
    }

    public async Task<bool> Handle(
        DeleteStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var result = await _environmentVariablesService.DeleteEnvironmentVariable(
                request.Id,
                request.StackId
            );

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error deleting environment variable {Id} for stack {StackId}",
                request.Id,
                request.StackId
            );
            return false;
        }
    }
}
