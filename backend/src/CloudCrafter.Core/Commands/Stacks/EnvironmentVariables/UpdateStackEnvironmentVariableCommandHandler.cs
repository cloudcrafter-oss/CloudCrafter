using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class UpdateStackEnvironmentVariableCommandHandler
    : IRequestHandler<UpdateStackEnvironmentVariableCommand, bool>
{
    private readonly IStackEnvironmentVariablesService _environmentVariablesService;
    private readonly ILogger<UpdateStackEnvironmentVariableCommandHandler> _logger;

    public UpdateStackEnvironmentVariableCommandHandler(
        IStackEnvironmentVariablesService environmentVariablesService,
        ILogger<UpdateStackEnvironmentVariableCommandHandler> logger
    )
    {
        _environmentVariablesService = environmentVariablesService;
        _logger = logger;
    }

    public async Task<bool> Handle(
        UpdateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var result = await _environmentVariablesService.UpdateEnvironmentVariable(
                request.Id,
                request.StackId,
                request.Key,
                request.Value
            );

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error updating environment variable {Id} for stack {StackId}",
                request.Id,
                request.StackId
            );
            return false;
        }
    }
}
