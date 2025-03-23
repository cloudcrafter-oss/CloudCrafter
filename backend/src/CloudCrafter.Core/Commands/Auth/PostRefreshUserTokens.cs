using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using MediatR;

namespace CloudCrafter.Core.Commands.Auth;

public record RefreshUserTokenCommand(string RefreshToken) : IRequest<TokenDto>;

public class RefreshUserTokenCommandHandler : IRequestHandler<RefreshUserTokenCommand, TokenDto>
{
    private readonly ICloudCrafterAuthService _service;

    public RefreshUserTokenCommandHandler(ICloudCrafterAuthService service)
    {
        _service = service;
    }

    public async Task<TokenDto> Handle(
        RefreshUserTokenCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _service.FetchTokensForRefreshToken(request.RefreshToken);
    }
}
