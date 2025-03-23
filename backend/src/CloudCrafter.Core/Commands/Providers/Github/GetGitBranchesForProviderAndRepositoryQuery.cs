using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

// TODO: Add future check for ACL on provider
//  [Authorize]
public record GetGitBranchesQuery(Guid ProviderId, string RepositoryId)
    : IRequest<List<GitProviderBranchDto>>;

public class GetGitBranchesQueryHandler
    : IRequestHandler<GetGitBranchesQuery, List<GitProviderBranchDto>>
{
    private readonly IProvidersService _service;

    public GetGitBranchesQueryHandler(IProvidersService service)
    {
        _service = service;
    }

    public Task<List<GitProviderBranchDto>> Handle(
        GetGitBranchesQuery request,
        CancellationToken cancellationToken
    )
    {
        return _service.GetBranches(request.ProviderId, request.RepositoryId);
    }
}
