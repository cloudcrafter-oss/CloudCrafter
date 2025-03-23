using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

// TODO: Add future check for ACL on provider
[Authorize]
public record GetGitBranchesQuery(Guid ProviderId, string RepositoryId)
    : IRequest<List<GitProviderBranchDto>>;

public class GetGitBranchesQueryHandler(IProvidersService service)
    : IRequestHandler<GetGitBranchesQuery, List<GitProviderBranchDto>>
{
    public Task<List<GitProviderBranchDto>> Handle(
        GetGitBranchesQuery request,
        CancellationToken cancellationToken
    )
    {
        return service.GetBranches(request.ProviderId, request.RepositoryId);
    }
}
