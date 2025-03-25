using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using MediatR;

namespace CloudCrafter.Core.Commands.Auth;

public record RefreshUserTokenCommand(string RefreshToken) : IRequest<TokenDto>;

public class RefreshUserTokenCommandHandler(ICloudCrafterAuthService service)
    : IRequestHandler<RefreshUserTokenCommand, TokenDto>
{
    public async Task<TokenDto> Handle(
        RefreshUserTokenCommand request,
        CancellationToken cancellationToken
    )
    {
        return await service.FetchTokensForRefreshToken(request.RefreshToken);
    }
}
