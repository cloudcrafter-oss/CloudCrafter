using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class GetStackDetail
{
    [Authorize]
    public class Query : IRequest<StackDetailDto?>, IRequireStackAccess
    {
        public required Guid StackId { get; init; }
    }

    private class Handler(IStacksService stacksService) : IRequestHandler<Query, StackDetailDto?>
    {
        public async Task<StackDetailDto?> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return await stacksService.GetStackDetail(request.StackId);
        }
    }
}
