using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

// TODO: Add future check for ACL on provider
//  [Authorize]
public record GetGitRepositoriesQuery(Guid ProviderId) : IRequest<List<GitProviderRepositoryDto>>;

public class GetGitRepositoriesQueryHandler
    : IRequestHandler<GetGitRepositoriesQuery, List<GitProviderRepositoryDto>>
{
    private readonly IProvidersService _service;

    public GetGitRepositoriesQueryHandler(IProvidersService service)
    {
        _service = service;
    }

    public Task<List<GitProviderRepositoryDto>> Handle(
        GetGitRepositoriesQuery request,
        CancellationToken cancellationToken
    )
    {
        return _service.GetGitRepositories(request.ProviderId);
    }
}
