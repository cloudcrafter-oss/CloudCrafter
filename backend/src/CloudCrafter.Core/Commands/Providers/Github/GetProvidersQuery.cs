using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

public static class GetProvidersQuery
{
    [Authorize]
    public record Query(ProviderFilterRequest Filter) : IRequest<List<SourceProviderDto>>;

    public class Handler(IProvidersService service)
        : IRequestHandler<Query, List<SourceProviderDto>>
    {
        public Task<List<SourceProviderDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return service.GetProviders(request.Filter);
        }
    }
}
