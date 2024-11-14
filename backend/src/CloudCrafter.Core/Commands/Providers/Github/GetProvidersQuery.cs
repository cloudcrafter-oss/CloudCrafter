using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

public static class GetProvidersQuery
{
    [Authorize]
    public record Query : IRequest<ProviderOverviewDto>;

    public class Handler(IProvidersService service) : IRequestHandler<Query, ProviderOverviewDto>
    {
        public Task<ProviderOverviewDto> Handle(Query request, CancellationToken cancellationToken)
        {
            return service.GetProviders();
        }
    }
}
