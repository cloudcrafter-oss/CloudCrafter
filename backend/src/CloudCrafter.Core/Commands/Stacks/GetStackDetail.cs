using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

[Authorize]
public class GetStackDetailQuery : IRequest<StackDetailDto?>, IRequireStackAccess
{
    public required Guid StackId { get; init; }
}

internal class GetStackDetailQueryHandler(IStacksService stacksService)
    : IRequestHandler<GetStackDetailQuery, StackDetailDto?>
{
    public async Task<StackDetailDto?> Handle(
        GetStackDetailQuery request,
        CancellationToken cancellationToken
    )
    {
        return await stacksService.GetStackDetail(request.StackId);
    }
}
