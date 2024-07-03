using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using MediatR;

namespace CloudCrafter.Core.Commands.Auth;

public static class PostRefreshUserTokens
{
    public record Query(string RefreshToken) : IRequest<TokenDto>;

    private class Handler(ICloudCrafterAuthService service) : IRequestHandler<Query, TokenDto>
    {
        public async Task<TokenDto> Handle(Query request, CancellationToken cancellationToken)
        {
            return await service.FetchTokensForRefreshToken(request.RefreshToken);
        }
    }
}
