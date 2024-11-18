using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Stacks.Filters;
using CloudCrafter.Domain.Domain.Deployment;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class GetStackSimpleDeployments
{
    [Authorize]
    public record Query(Guid StackId) : IRequest<List<SimpleDeploymentDto>>, IRequireStackAccess;

    public class Handler(IStacksService stacksService)
        : IRequestHandler<Query, List<SimpleDeploymentDto>>
    {
        public async Task<List<SimpleDeploymentDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return await stacksService.GetDeployments(
                new DeploymentsFilter { StackId = request.StackId }
            );
        }
    }
}
