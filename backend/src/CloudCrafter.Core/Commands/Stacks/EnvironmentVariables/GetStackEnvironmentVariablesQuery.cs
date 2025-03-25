using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record GetStackEnvironmentVariablesQuery(Guid StackId, bool IncludeSecrets = false)
    : IRequest<List<StackEnvironmentVariableDto>>;

public class GetStackEnvironmentVariablesQueryHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<GetStackEnvironmentVariablesQuery, List<StackEnvironmentVariableDto>>
{
    public async Task<List<StackEnvironmentVariableDto>> Handle(
        GetStackEnvironmentVariablesQuery request,
        CancellationToken cancellationToken
    )
    {
        return await environmentVariablesService.GetEnvironmentVariables(
            request.StackId,
            request.IncludeSecrets
        );
    }
}
