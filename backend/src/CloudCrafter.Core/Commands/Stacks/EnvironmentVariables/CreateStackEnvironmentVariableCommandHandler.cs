using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class CreateStackEnvironmentVariableCommandHandler
    : IRequestHandler<CreateStackEnvironmentVariableCommand, bool>
{
    private readonly IStackEnvironmentVariablesService _environmentVariablesService;
    private readonly ILogger<CreateStackEnvironmentVariableCommandHandler> _logger;

    public CreateStackEnvironmentVariableCommandHandler(
        IStackEnvironmentVariablesService environmentVariablesService,
        ILogger<CreateStackEnvironmentVariableCommandHandler> logger
    )
    {
        _environmentVariablesService = environmentVariablesService;
        _logger = logger;
    }

    public async Task<bool> Handle(
        CreateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var result = await _environmentVariablesService.CreateEnvironmentVariable(
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
                "Error creating environment variable for stack {StackId}",
                request.StackId
            );
            return false;
        }
    }
}
