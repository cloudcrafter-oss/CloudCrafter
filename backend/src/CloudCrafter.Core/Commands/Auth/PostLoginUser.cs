using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using MediatR;

namespace CloudCrafter.Core.Commands.Auth;

public record LoginUserCommand(string Email, string Password) : IRequest<TokenDto>;

public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, TokenDto>
{
    private readonly ICloudCrafterAuthService _service;

    public LoginUserCommandHandler(ICloudCrafterAuthService service)
    {
        _service = service;
    }

    public async Task<TokenDto> Handle(
        LoginUserCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _service.LoginAsync(request.Email, request.Password);
    }
}
