using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

public static class GetGitBranchesForProviderAndRepositoryQuery
{
    // TODO: Add future check for ACL on provider
    //  [Authorize]
    public record Query(Guid ProviderId, string RepositoryId)
        : IRequest<List<GitProviderBranchDto>>;

    public class Handler(IProvidersService service)
        : IRequestHandler<Query, List<GitProviderBranchDto>>
    {
        public Task<List<GitProviderBranchDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return service.GetBranches(request.ProviderId, request.RepositoryId);
        }
    }
}
