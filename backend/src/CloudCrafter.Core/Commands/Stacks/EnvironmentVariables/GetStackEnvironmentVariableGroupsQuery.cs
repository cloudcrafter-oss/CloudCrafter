using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record GetStackEnvironmentVariableGroupsQuery(Guid StackId)
    : IRequest<List<StackEnvironmentVariableGroupDto>>;

public class GetStackEnvironmentVariableGroupsQueryHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<GetStackEnvironmentVariableGroupsQuery, List<StackEnvironmentVariableGroupDto>>
{
    public async Task<List<StackEnvironmentVariableGroupDto>> Handle(
        GetStackEnvironmentVariableGroupsQuery request,
        CancellationToken cancellationToken
    )
    {
        return await environmentVariablesService.GetEnvironmentVariableGroups(request.StackId);
    }
}
