using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

public static class GetGithubRepositoriesQuery
{
    // TODO: Add future check for ACL on provider
    //  [Authorize]
    public record Query(Guid ProviderId) : IRequest<List<GitProviderRepositoryDto>>;

    public class Handler(IProvidersService service)
        : IRequestHandler<Query, List<GitProviderRepositoryDto>>
    {
        public Task<List<GitProviderRepositoryDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return service.GetGithubRepositories(request.ProviderId);
        }
    }
}
