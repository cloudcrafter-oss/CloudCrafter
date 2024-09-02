using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
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
}
