using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

// TODO: Add future check for ACL on provider
[Authorize]
public record GetGitRepositoriesQuery(Guid ProviderId) : IRequest<List<GitProviderRepositoryDto>>;

public class GetGitRepositoriesQueryHandler(IProvidersService service)
    : IRequestHandler<GetGitRepositoriesQuery, List<GitProviderRepositoryDto>>
{
    public Task<List<GitProviderRepositoryDto>> Handle(
        GetGitRepositoriesQuery request,
        CancellationToken cancellationToken
    )
    {
        return service.GetGitRepositories(request.ProviderId);
    }
}
