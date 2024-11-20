using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Stacks.Filters;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Requests.Filtering;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class GetServerSimpleDeployments
{
    [Authorize]
    public record Query(Guid ServerId, BasePaginationRequest PaginatedRequest)
        : IRequest<PaginatedList<SimpleDeploymentDto>>, IRequireServerAccess;

    private class Handler(IStacksService stacksService)
        : IRequestHandler<Query, PaginatedList<SimpleDeploymentDto>>
    {
        public async Task<PaginatedList<SimpleDeploymentDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return await stacksService.GetDeploymentsPaginated(
                new DeploymentsFilter { ServerId = request.ServerId }, request.PaginatedRequest
            );
        }
    }
}
