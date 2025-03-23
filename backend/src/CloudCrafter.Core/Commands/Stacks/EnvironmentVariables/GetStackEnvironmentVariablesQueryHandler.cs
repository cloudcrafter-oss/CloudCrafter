using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stacks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public class GetStackEnvironmentVariablesQueryHandler(
    IStackEnvironmentVariablesService environmentVariablesService,
    ILogger<GetStackEnvironmentVariablesQueryHandler> logger
) : IRequestHandler<GetStackEnvironmentVariablesQuery, List<StackEnvironmentVariableDto>>
{
    public async Task<List<StackEnvironmentVariableDto>> Handle(
        GetStackEnvironmentVariablesQuery request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            return await environmentVariablesService.GetEnvironmentVariables(
                request.StackId,
                request.IncludeInherited,
                request.IncludeSecrets
            );
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error retrieving environment variables for stack {StackId}",
                request.StackId
            );
            throw;
        }
    }
}
