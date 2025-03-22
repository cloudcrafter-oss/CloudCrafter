using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stacks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class GetStackEnvironmentVariablesQueryHandler
    : IRequestHandler<GetStackEnvironmentVariablesQuery, List<StackEnvironmentVariableDto>>
{
    private readonly IStackEnvironmentVariablesService _environmentVariablesService;
    private readonly ILogger<GetStackEnvironmentVariablesQueryHandler> _logger;

    public GetStackEnvironmentVariablesQueryHandler(
        IStackEnvironmentVariablesService environmentVariablesService,
        ILogger<GetStackEnvironmentVariablesQueryHandler> logger
    )
    {
        _environmentVariablesService = environmentVariablesService;
        _logger = logger;
    }

    public async Task<List<StackEnvironmentVariableDto>> Handle(
        GetStackEnvironmentVariablesQuery request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            return await _environmentVariablesService.GetEnvironmentVariables(
                request.StackId,
                request.IncludeInherited,
                request.IncludeSecrets
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error retrieving environment variables for stack {StackId}",
                request.StackId
            );
            throw;
        }
    }
}
