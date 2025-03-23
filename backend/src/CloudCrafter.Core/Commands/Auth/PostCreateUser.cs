using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using MediatR;

namespace CloudCrafter.Core.Commands.Auth;

public record CreateUserCommand(string Email, string Name) : IRequest<TokenDto>;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, TokenDto>
{
    private readonly ICloudCrafterAuthService _service;

    public CreateUserCommandHandler(ICloudCrafterAuthService service)
    {
        _service = service;
    }

    public async Task<TokenDto> Handle(
        CreateUserCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _service.CreateUserAsync(request.Email, request.Name);
    }
}
