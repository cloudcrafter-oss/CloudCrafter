using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using MediatR;

namespace CloudCrafter.Core.Commands.Auth;

public record LoginUserCommand(string Email, string Password) : IRequest<TokenDto>;

public class LoginUserCommandHandler(ICloudCrafterAuthService service)
    : IRequestHandler<LoginUserCommand, TokenDto>
{
    public async Task<TokenDto> Handle(
        LoginUserCommand request,
        CancellationToken cancellationToken
    )
    {
        return await service.LoginAsync(request.Email, request.Password);
    }
}
